import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import telegramConfig from './config/telegram.config';
import { TelegramService } from './telegram.service';
import { HttpModule } from '@nestjs/axios';

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
export class TelegramModule {}
