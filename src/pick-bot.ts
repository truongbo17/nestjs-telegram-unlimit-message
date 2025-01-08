import {
  BotClusterInterface,
  BotInterface,
  PickBotInterface,
} from './interfaces';
import { CallbackType } from './types/callback.type';

export class PickBot implements PickBotInterface {
  public pick(
    botCluster: BotClusterInterface,
    callback?: CallbackType
  ): BotInterface | null {
    return undefined;
  }
}
