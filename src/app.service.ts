import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  environment?: string;

  constructor(private readonly configService: ConfigService) {
    this.environment = this.configService.get('NODE_ENV');
  }

  home(): string {
    return `API: ${this.environment ?? '-'}`;
  }
}
