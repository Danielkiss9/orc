import { Injectable, Logger } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { KubeService } from '../../kube/kube.service';
import { ConfigService } from '../../config/config.service';
import { CleanupResult } from '../../types';
import { enrichKubernetesObject, getLabelSelector } from '../../utils/kube';

@Injectable()
export class PdbScanner extends BaseResourceScanner<k8s.V1PodDisruptionBudget> {
  constructor(private readonly kubeService: KubeService, config: ConfigService) {
    super(config);
  }

  async scan(): Promise<k8s.V1PodDisruptionBudget[]> {
    try {
      const response = await this.kubeService.policyApi.listPodDisruptionBudgetForAllNamespaces();
      return response.items.map((pdb) => enrichKubernetesObject(pdb, 'PodDisruptionBudget'));
    } catch (error) {
      this.logger.error(`Failed to scan PodDisruptionBudgets (PDBs): ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(pdb: k8s.V1PodDisruptionBudget): Promise<boolean> {
    try {
      if (!pdb.spec?.selector?.matchLabels) {
        const pods = await this.kubeService.coreApi.listNamespacedPod({
          namespace: pdb.metadata.namespace,
        });

        return pods.items.length === 0;
      }

      const labelSelector = getLabelSelector(pdb.spec.selector.matchLabels);
      const request = { namespace: pdb.metadata.namespace, labelSelector };

      const [pods, deployments, statefulsets] = await Promise.all([
        this.kubeService.coreApi.listNamespacedPod(request),
        this.kubeService.appsApi.listNamespacedDeployment(request),
        this.kubeService.appsApi.listNamespacedStatefulSet(request),
      ]);

      return !pods.items.length && !deployments.items.length && !statefulsets.items.length;
    } catch (error) {
      this.logger.error(`Failed to check PDB ${pdb.metadata.namespace}/${pdb.metadata.name}: ${error.message}`);
      throw error;
    }
  }

  async cleanup(pdb: k8s.V1PodDisruptionBudget): Promise<CleanupResult<k8s.V1PodDisruptionBudget>> {
    try {
      await this.kubeService.policyApi.deleteNamespacedPodDisruptionBudget({
        name: pdb.metadata.name,
        namespace: pdb.metadata.namespace,
      });

      return {
        resource: pdb,
        success: true,
      };
    } catch (error) {
      return {
        resource: pdb,
        success: false,
        error: error.message,
      };
    }
  }
}
