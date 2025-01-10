import { BotInterface } from './bot.interface';
import { BotClusterInterface } from './bot.cluster.interface';
import { CallbackType } from '../types/callback.type';

export interface PickBotInterface {
  pick(
    botCluster: BotClusterInterface,
    callback?: CallbackType
  ): Promise<BotInterface | null>;
}
