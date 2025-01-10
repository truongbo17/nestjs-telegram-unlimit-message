import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import telegramConfig from './config/telegram.config';
import { TelegramService } from './telegram.service';
import { HttpModule } from '@nestjs/axios';
import {
  TelegramModuleAsyncOptions,
  TelegramModuleOptions,
  TelegramOptionsFactory,
} from './interfaces/telegram-module-option.interface';
import { createTelegramProvider } from './telegram.provider';
import { TELEGRAM_MODULE_PROVIDER } from './constants/telegram.constant';

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

  static forRootAsync(options: TelegramModuleAsyncOptions): DynamicModule {
    const provider: Provider[] = this.createAsyncProvider(options);
    return {
      module: TelegramModule,
      imports: options.imports || [],
      providers: provider,
      exports: provider,
    };
  }

  private static createAsyncProvider(
    options: TelegramModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: TelegramModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: TELEGRAM_MODULE_PROVIDER,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: TELEGRAM_MODULE_PROVIDER,
      useFactory: async (optionsFactory: TelegramOptionsFactory) =>
        await optionsFactory.createTelegramOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
