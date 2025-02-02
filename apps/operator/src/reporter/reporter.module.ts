import { Module } from '@nestjs/common';
import { ReporterService } from './reporter.service';
import { TokenManagerModule } from '../token-manager/token-manager.module';

@Module({
  imports: [TokenManagerModule],
  providers: [ReporterService],
  exports: [ReporterService],
})
export class ReporterModule {}
