import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ScannerService } from './scanner/scanner.service';
import { ConfigService } from './config/config.service';
import { ReporterService } from './reporter/reporter.service';
import { TokenManagerService } from './token-manager/token-manager.service';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  private initialized = false;

  constructor(
    private readonly scannerService: ScannerService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly reporterService: ReporterService,
    private readonly tokenManager: TokenManagerService,
  ) {}

  async onModuleInit() {
    try {
      this.tokenManager.getToken();
      this.initialized = true;

      await this.runScan();
    } catch (error) {
      this.logger.error('Failed to initialize operator:', error);
      throw new Error('Operator initialization failed - cluster registration required');
    }
  }

  private async runScan() {
    if (!this.initialized) {
      this.logger.error('Attempted to run scan before initialization');
      return;
    }

    try {
      this.logger.log(`Starting scan at ${new Date().toISOString()}`);
      const results = await this.scannerService.scan();
      this.logger.log(`Scan completed. Found ${results.summary.totalOrphaned} orphaned resources`);

      this.logger.log('Sending report to console');
      await this.reporterService.sendReport(results);
      this.logger.log('Report sent successfully');
    } catch (error) {
      this.logger.error(`Scan failed: ${error.message}`);
    }
  }
}
