import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import telegramConfig from './config/telegram.config';
import { TelegramService } from './telegram.service';
import { HttpModule } from '@nestjs/axios';
import { TelegramModuleOptions } from './interfaces/telegram-module-option.interface';
import { createTelegramProvider } from './telegram.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [telegramConfig],
    }),
    HttpModule.registerAsync({
      useFactory: (
        configService: ConfigService
      ): { maxRedirects: number; timeout: number } => ({
        timeout: <number>configService.get('api.timeout'),
        maxRedirects: <number>configService.get('api.maxRedirects'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {
  static forRoot(options: TelegramModuleOptions): DynamicModule {
    return {
      module: TelegramModule,
      providers: createTelegramProvider(options),
    };
  }
}
