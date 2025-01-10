import {
  BotClusterInterface,
  BotInterface,
  PickBotInterface,
  StrategyInterface,
} from './interfaces';
import { CallbackType } from './types/callback.type';

export class PickBot implements PickBotInterface {
  constructor(private readonly strategy: StrategyInterface) {}

  public async pick(
    botCluster: BotClusterInterface,
    callback?: CallbackType
  ): Promise<BotInterface | null> {
    return await this.strategy.getBot(botCluster, callback);
  }
}
