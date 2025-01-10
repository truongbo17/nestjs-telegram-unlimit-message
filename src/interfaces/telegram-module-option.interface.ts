import { StrategyInterface } from './strategy.interface';
import { BotInterface } from './bot.interface';
import { ModuleMetadata, Type } from '@nestjs/common';

export interface TelegramModuleOptions {
  strategy: StrategyInterface;
  bots: BotInterface[];
  cacheService?: any;
}

export interface TelegramOptionsFactory {
  createTelegramOptions():
    | Promise<TelegramModuleOptions>
    | TelegramModuleOptions;
}

export interface TelegramModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<TelegramOptionsFactory>;
  useClass?: Type<TelegramOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<TelegramModuleOptions> | TelegramModuleOptions;
  inject?: any[];
}
