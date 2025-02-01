import { Injectable } from '@nestjs/common';

@Injectable()
export class OrcConfig {
  dryRun: boolean = true;
  ageThresholdDays: number = 7;
  batchSize: number = 10;
  ignoreAnnotations: string[] = ['orc/ignore-resource'];
  schedule: string = '0 0 * * *'; // Every day at midnight
  consoleUrl: string = 'http://localhost:3000';
  clusterToken: string = 'token';

  constructor(config?: Partial<OrcConfig>) {
    if (config) {
      Object.assign(this, config);
    }
  }
}
