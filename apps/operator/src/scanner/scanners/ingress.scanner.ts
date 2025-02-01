import { Injectable, Logger } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { KubeService } from '../../kube/kube.service';
import { ConfigService } from '../../config/config.service';
import { CleanupResult } from '../../types';
import { enrichKubernetesObject } from '../../utils/kube';

@Injectable()
export class IngressScanner extends BaseResourceScanner<k8s.V1Ingress> {
  constructor(private readonly kubeService: KubeService, config: ConfigService) {
    super(config);
  }

  async scan(): Promise<k8s.V1Ingress[]> {
    try {
      const response = await this.kubeService.networkingApi.listIngressForAllNamespaces();
      return response.items.map((ingress) => enrichKubernetesObject(ingress, 'Ingress'));
    } catch (error) {
      this.logger.error(`Failed to scan ingresses: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(ingress: k8s.V1Ingress): Promise<{ isOrphaned: boolean; reason?: string }> {
    try {
      const loadBalancerIngress = ingress.status?.loadBalancer?.ingress;

      if (!loadBalancerIngress || loadBalancerIngress.length === 0) {
        return {
          isOrphaned: true,
          reason: 'Missing load balancer configuration',
        };
      }

      const hasValidIngress = loadBalancerIngress.some((ing) => ing.hostname || ing.ip);

      return {
        isOrphaned: !hasValidIngress,
        reason: !hasValidIngress ? 'Load balancer has no valid IP or hostname' : undefined,
      };
    } catch (error) {
      this.logger.error(`Failed to check ingress ${ingress.metadata.namespace}/${ingress.metadata.name}: ${error.message}`);
      throw error;
    }
  }

  async cleanup(ingress: k8s.V1Ingress): Promise<CleanupResult<k8s.V1Ingress>> {
    try {
      await this.kubeService.networkingApi.deleteNamespacedIngress({
        name: ingress.metadata.name,
        namespace: ingress.metadata.namespace,
      });

      return {
        resource: ingress,
        success: true,
      };
    } catch (error) {
      return {
        resource: ingress,
        success: false,
        error: error.message,
      };
    }
  }
}
