import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { MailerService } from './mailer/mailer.service';

@Module({
  providers: [UtilsService, MailerService],
  exports: [UtilsService, MailerService],
})
export class UtilsModule {}
