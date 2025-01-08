import {
  BotClusterInterface,
  BotInterface,
  StrategyInterface,
} from '../interfaces';
import { InputRandomStrategyEnum } from '../enums/input-random-strategy.enum';
import { EmptyBotException } from '../exceptions/empty-bot.exception';
import { InputRandomStrategyException } from '../exceptions/input-random-strategy.exception';
import { MAX_RETRIES } from '../constants/random-strategy.constant';

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
    let proxyNode: BotInterface | null = null;
    const maxRetries: number = MAX_RETRIES;
    let attempt: number = 0;

    while (attempt < maxRetries) {
      const index: number = Math.floor(Math.random() * botCluster.count());

      proxyNode = botCluster.getBot(index);

      if (
        !proxyNode.hasCheckMaxUse(RandomStrategy.name) ||
        !proxyNode.checkCounter(RandomStrategy.name)
      ) {
        break;
      }

      attempt++;
    }

    return proxyNode;
  }

  private hasWeightRandom(
    botCluster: BotClusterInterface
  ): BotInterface | null {
    if (botCluster.isEmptyBotHasWeight()) {
      throw new EmptyBotException(
        'No node has weight . Please increase weight for node'
      );
    }
    let proxyNode: BotInterface | null = null;
    const maxRetries: number = MAX_RETRIES;
    let attempt: number = 0;

    while (attempt < maxRetries) {
      const index: number = Math.floor(
        Math.random() * botCluster.countBotHasWeight()
      );

      proxyNode = botCluster.getBotHasWeight(index);

      if (
        !proxyNode.hasCheckMaxUse(RandomStrategy.name) ||
        !proxyNode.checkCounter(RandomStrategy.name)
      ) {
        break;
      }

      attempt++;
    }

    return proxyNode;
  }

  private noWeightRandom(botCluster: BotClusterInterface): BotInterface | null {
    if (botCluster.isEmptyBotNoWeight()) {
      throw new EmptyBotException(
        'No node has weight . Please increase weight for node'
      );
    }
    let proxyNode: BotInterface | null = null;
    const maxRetries: number = MAX_RETRIES;
    let attempt: number = 0;

    while (attempt < maxRetries) {
      const index: number = Math.floor(
        Math.random() * botCluster.countBotNoWeight()
      );

      proxyNode = botCluster.getBotNoWeight(index);

      if (
        !proxyNode.hasCheckMaxUse(RandomStrategy.name) ||
        !proxyNode.checkCounter(RandomStrategy.name)
      ) {
        break;
      }

      attempt++;
    }

    return proxyNode;
  }
}
