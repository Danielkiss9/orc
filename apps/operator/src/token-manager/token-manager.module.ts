import { Module } from '@nestjs/common';
import { TokenManagerService } from './token-manager.service';
import { KubeModule } from '../kube/kube.module';

@Module({
  imports: [KubeModule],
  providers: [TokenManagerService],
  exports: [TokenManagerService],
})
export class TokenManagerModule {}
