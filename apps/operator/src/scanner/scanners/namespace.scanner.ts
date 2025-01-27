import { Injectable, Logger } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { KubeService } from '../../kube/kube.service';
import { ConfigService } from '../../config/config.service';
import { CleanupResult } from '../../types';
import { enrichKubernetesObject } from '../../utils/kube';

@Injectable()
export class NamespaceScanner extends BaseResourceScanner<k8s.V1Namespace> {
  constructor(private readonly kubeService: KubeService, config: ConfigService) {
    super(config);
  }

  async scan(): Promise<k8s.V1Namespace[]> {
    try {
      const response = await this.kubeService.coreApi.listNamespace();
      return response.items.map((namespace) => enrichKubernetesObject(namespace, 'Namespace'));
    } catch (error) {
      this.logger.error(`Failed to scan namespaces: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(namespace: k8s.V1Namespace): Promise<boolean> {
    if (
      namespace.metadata.name === 'default' ||
      namespace.metadata.name === 'kube-system' ||
      namespace.metadata.name === 'kube-public' ||
      namespace.metadata.name === 'kube-node-lease'
    ) {
      return false;
    }

    const listRequest = {
      namespace: namespace.metadata.name,
    };

    try {
      const promises = [
        this.kubeService.coreApi.listNamespacedPod(listRequest),
        this.kubeService.coreApi.listNamespacedService(listRequest),
        this.kubeService.appsApi.listNamespacedDeployment(listRequest),
        this.kubeService.coreApi.listNamespacedConfigMap(listRequest),
        this.kubeService.coreApi.listNamespacedSecret(listRequest),
      ];

      const [pods, services, deployments, configmaps, secrets] = await Promise.all(promises);

      return (
        pods.items.length === 0 &&
        services.items.length === 0 &&
        deployments.items.length === 0 &&
        configmaps.items.length === 0 &&
        secrets.items.length === 0
      );
    } catch (error) {
      this.logger.error(`Failed to check namespace ${namespace.metadata.name}: ${error.message}`);
      throw error;
    }
  }

  async cleanup(namespace: k8s.V1Namespace): Promise<CleanupResult<k8s.V1Namespace>> {
    try {
      await this.kubeService.coreApi.deleteNamespace({
        name: namespace.metadata.name,
      });

      return {
        resource: namespace,
        success: true,
      };
    } catch (error) {
      return {
        resource: namespace,
        success: false,
        error: error.message,
      };
    }
  }
}
