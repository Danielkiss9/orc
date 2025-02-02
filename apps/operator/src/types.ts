import { V1ObjectMeta } from '@kubernetes/client-node';

export interface OrphanedResource {
  resource: K8sResource;
  reason?: string;
}

export interface K8sResource {
  metadata?: V1ObjectMeta;
  kind?: string;
  apiVersion?: string;
}

export interface CleanupResult<T extends K8sResource> {
  resource: T;
  success: boolean;
  error?: string;
}

export interface ScanReport<T extends K8sResource> {
  resourceType: string;
  totalResources: number;
  orphanedResources: OrphanedResource[]; 
  processedResources: T[];
  skippedResources: T[];
  errors: string[];
  timestamp: Date;
}

export interface BatchScanReport {
  reports: ScanReport<K8sResource>[];
  summary: {
    totalScanned: number;
    totalOrphaned: number;
    totalSkipped: number;
    totalErrors: number;
    scanDuration: number;
  };
  timestamp: Date;
}

export interface ResourceScanner<T extends K8sResource> {
  scan(): Promise<T[]>;
  isOrphaned(resource: T): Promise<boolean>;
  cleanup(resource: T, dryRun: boolean): Promise<CleanupResult<T>>;
  shouldProcess(resource: T): boolean;
}

export interface Config {
  dryRun: boolean;
  batchSize: number;
  cleanupInterval: number;
  ignoreAnnotations: string[];
}
