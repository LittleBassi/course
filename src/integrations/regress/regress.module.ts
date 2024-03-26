import { Module } from '@nestjs/common';
import { RegressService } from './services/regress.service';

@Module({
  providers: [RegressService],
  exports: [RegressService],
})
export class RegressModule {}
