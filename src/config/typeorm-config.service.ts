import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { resolve } from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly isDevEnvironment: boolean;
  private readonly isLoggingActive: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isDevEnvironment = this.configService.get('NODE_ENV') === 'developmentSync';
    this.isLoggingActive = this.configService.get('APP_LOG') === 'true';
  }

  // Não é necessário modificar nenhuma configuração abaixo
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      database: this.configService.get('DB_NAME'),
      entities: [resolve(__dirname, '**', '*.entity{.ts,.js}')],
      autoLoadEntities: true,
      synchronize: this.isDevEnvironment,
      logging: this.isLoggingActive,
      keepConnectionAlive: true,
      poolSize: this.configService.get<number>('DB_POOL_SIZE'),
    };
  }
}
