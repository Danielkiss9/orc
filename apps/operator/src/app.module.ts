import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { KubeModule } from './kube/kube.module';
import { ScannerModule } from './scanner/scanner.module';
import { ConfigModule } from './config/config.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './health/health.module';
import { ReporterModule } from './reporter/reporter.module';

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot(), KubeModule, HealthModule, ScannerModule, ReporterModule],
  providers: [AppService],
})
export class AppModule {}
