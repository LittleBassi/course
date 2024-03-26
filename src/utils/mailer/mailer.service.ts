import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SendEmailDto } from './mailer.interface';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailerService {
  private readonly mailerHost: string;
  private readonly mailerUser: string;
  private readonly mailerPassword: string;
  private readonly defaultMailerFrom: string;
  private readonly defaultMailerName: string;
  constructor(private readonly configService: ConfigService) {
    this.mailerHost = this.configService.get<string>('EMAIL_HOST');
    this.mailerUser = this.configService.get<string>('EMAIL_USER');
    this.mailerPassword = this.configService.get<string>('EMAIL_PASSWORD');
    this.defaultMailerFrom = this.configService.get<string>('DEFAULT_MAIL_FROM');
    this.defaultMailerName = this.configService.get<string>('DEFAULT_MAIL_NAME');
  }

  async mailTransport(): Promise<nodemailer.Transporter<SMTPTransport.SentMessageInfo>> {
    const transporter = nodemailer.createTransport({
      host: this.mailerHost,
      port: 465,
      secure: false,
      auth: {
        user: this.mailerUser,
        pass: this.mailerPassword,
      },
    });
    return transporter;
  }

  async sendEmail(dto: SendEmailDto): Promise<SMTPTransport.SentMessageInfo> {
    const { from, recipients, subject, html } = dto;

    const transport = await this.mailTransport();

    const options: Mail.Options = {
      from: from ?? {
        name: this.defaultMailerName,
        address: this.defaultMailerFrom,
      },
      to: recipients,
      subject,
      html,
    };
    try {
      const result = await transport.sendMail(options);

      return result;
    } catch (error) {
      console.log('Error: ', error);
    }
  }
}
