import { BotClusterInterface } from './bot.cluster.interface';
import { CallbackType } from '../types/callback.type';
import { BotInterface } from './bot.interface';

export interface StrategyInterface {
  getBot(
    botCluster: BotClusterInterface,
    callback?: CallbackType
  ): BotInterface | null;
}
