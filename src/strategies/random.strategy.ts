import {
  BotClusterInterface,
  BotInterface,
  StrategyInterface,
} from '../interfaces';
import { InputRandomStrategyEnum } from '../enums/input-random-strategy.enum';
import { EmptyBotException } from '../exceptions/empty-bot.exception';
import { InputRandomStrategyException } from '../exceptions/input-random-strategy.exception';

export class RandomStrategy implements StrategyInterface {
  constructor(private readonly inputRandom: InputRandomStrategyEnum) {}

  public getBot(botCluster: BotClusterInterface): BotInterface | null {
    if (botCluster.isEmpty()) {
      throw new EmptyBotException();
    }

    switch (this.inputRandom) {
      case InputRandomStrategyEnum.BOTH:
        return this.bothRandom(botCluster);
      case InputRandomStrategyEnum.HAS_WEIGHT:
        return this.hasWeightRandom(botCluster);
      case InputRandomStrategyEnum.NO_WEIGHT:
        return this.noWeightRandom(botCluster);
      default:
        throw new InputRandomStrategyException();
    }
  }

  private bothRandom(botCluster: BotClusterInterface): BotInterface | null {
    return botCluster.getBot(1);
  }

  private hasWeightRandom(
    botCluster: BotClusterInterface
  ): BotInterface | null {
    return botCluster.getBot(1);
  }

  private noWeightRandom(botCluster: BotClusterInterface): BotInterface | null {
    return botCluster.getBot(1);
  }
}
