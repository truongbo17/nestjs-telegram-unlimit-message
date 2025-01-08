import {
  BotClusterInterface,
  BotInterface,
  PickBotInterface,
  StrategyInterface,
} from './interfaces';
import { CallbackType } from './types/callback.type';

export class PickBot implements PickBotInterface {
  constructor(private readonly strategy: StrategyInterface) {}

  public pick(
    botCluster: BotClusterInterface,
    callback?: CallbackType
  ): BotInterface | null {
    return this.strategy.getBot(botCluster, callback);
  }
}
