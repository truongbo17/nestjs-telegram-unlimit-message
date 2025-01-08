import { StrategyInterface } from './strategy.interface';
import { BotInterface } from './bot.interface';

export interface TelegramModuleOptions {
  strategy: StrategyInterface;
  bots: BotInterface[];
}
