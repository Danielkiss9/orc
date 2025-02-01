import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ScannerService } from './scanner/scanner.service';
import { ConfigService } from './config/config.service';
import { ReporterService } from './reporter/reporter.service';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly scannerService: ScannerService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly reporterService: ReporterService,
  ) {}

  async onModuleInit() {
    await this.runScan();
  }

  private async runScan() {
    try {
      this.logger.log(`Starting scan at ${new Date().toISOString()}`);
      console.log(`ScannerService: ${this.scannerService}`);
      const results = await this.scannerService.scan();
      this.logger.log(`Scan completed. Found ${results.summary.totalOrphaned} orphaned resources`);
      this.logger.log(`Sending report to console`);
      await this.reporterService.sendReport(results);
      this.logger.log(`Report sent`);
    } catch (error) {
      this.logger.error(`Scan failed: ${error.message}`);
    }
  }
}
