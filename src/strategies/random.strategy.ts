import {
  BotClusterInterface,
  BotInterface,
  StrategyInterface,
} from '../interfaces';
import { InputRandomStrategyEnum } from '../enums';
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
    let bot: BotInterface | null = null;
    const maxRetries: number = MAX_RETRIES;
    let attempt: number = 0;

    while (attempt < maxRetries) {
      const index: number = Math.floor(Math.random() * botCluster.count());

      bot = botCluster.getBot(index);

      if (
        !bot.hasCheckMaxUse(RandomStrategy.name, botCluster.getChatId()) ||
        !bot.checkCounter(RandomStrategy.name, botCluster.getChatId())
      ) {
        break;
      }

      attempt++;
    }

    return bot;
  }

  private hasWeightRandom(
    botCluster: BotClusterInterface
  ): BotInterface | null {
    if (botCluster.isEmptyBotHasWeight()) {
      throw new EmptyBotException(
        'No node has weight . Please increase weight for node'
      );
    }
    let bot: BotInterface | null = null;
    const maxRetries: number = MAX_RETRIES;
    let attempt: number = 0;

    while (attempt < maxRetries) {
      const index: number = Math.floor(
        Math.random() * botCluster.countBotHasWeight()
      );

      bot = botCluster.getBotHasWeight(index);

      if (
        !bot.hasCheckMaxUse(RandomStrategy.name, botCluster.getChatId()) ||
        !bot.checkCounter(RandomStrategy.name, botCluster.getChatId())
      ) {
        break;
      }

      attempt++;
    }

    return bot;
  }

  private noWeightRandom(botCluster: BotClusterInterface): BotInterface | null {
    if (botCluster.isEmptyBotNoWeight()) {
      throw new EmptyBotException(
        'No node has weight . Please increase weight for node'
      );
    }
    let bot: BotInterface | null = null;
    const maxRetries: number = MAX_RETRIES;
    let attempt: number = 0;

    while (attempt < maxRetries) {
      const index: number = Math.floor(
        Math.random() * botCluster.countBotNoWeight()
      );

      bot = botCluster.getBotNoWeight(index);

      if (
        !bot.hasCheckMaxUse(RandomStrategy.name, botCluster.getChatId()) ||
        !bot.checkCounter(RandomStrategy.name, botCluster.getChatId())
      ) {
        break;
      }

      attempt++;
    }

    return bot;
  }
}
