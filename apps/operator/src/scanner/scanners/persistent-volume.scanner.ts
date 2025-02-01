import { Injectable } from '@nestjs/common';
import { BaseResourceScanner } from '../base.scanner';
import * as k8s from '@kubernetes/client-node';
import { KubeService } from '../../kube/kube.service';
import { ConfigService } from '../../config/config.service';
import { CleanupResult } from '../../types';
import { enrichKubernetesObject } from '../../utils/kube';

@Injectable()
export class PersistentVolumeScanner extends BaseResourceScanner<k8s.V1PersistentVolume> {

  constructor(private readonly kubeService: KubeService, config: ConfigService) {
    super(config);
  }

  async scan(): Promise<k8s.V1PersistentVolume[]> {
    try {
      const response = await this.kubeService.coreApi.listPersistentVolume();
      return response.items.map((pv) => enrichKubernetesObject(pv, 'PersistentVolume') as k8s.V1PersistentVolume);
    } catch (error) {
      this.logger.error(`Failed to scan PersistentVolume: ${error.message}`);
      throw error;
    }
  }

  async isOrphaned(pv: k8s.V1PersistentVolume): Promise<boolean> {
    return pv.status?.phase !== 'Bound';
  }

  async cleanup(pv: k8s.V1PersistentVolume): Promise<CleanupResult<k8s.V1PersistentVolume>> {
    try {
      await this.kubeService.coreApi.deletePersistentVolume({
        name: pv.metadata.name,
      });

      return {
        resource: pv,
        success: true,
      };
    } catch (error) {
      return {
        resource: pv,
        success: false,
        error: error.message,
      };
    }
  }
}
