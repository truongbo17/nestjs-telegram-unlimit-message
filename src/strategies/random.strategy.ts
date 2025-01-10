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

  public async getBot(
    botCluster: BotClusterInterface
  ): Promise<BotInterface | null> {
    if (botCluster.isEmpty()) {
      throw new EmptyBotException();
    }

    switch (this.inputRandom) {
      case InputRandomStrategyEnum.BOTH:
        return await this.bothRandom(botCluster);
      case InputRandomStrategyEnum.HAS_WEIGHT:
        return await this.hasWeightRandom(botCluster);
      case InputRandomStrategyEnum.NO_WEIGHT:
        return await this.noWeightRandom(botCluster);
      default:
        throw new InputRandomStrategyException();
    }
  }

  private async bothRandom(
    botCluster: BotClusterInterface
  ): Promise<BotInterface | null> {
    let bot: BotInterface | null = null;
    const maxRetries: number = MAX_RETRIES;
    let attempt: number = 0;

    while (attempt < maxRetries) {
      const index: number = Math.floor(Math.random() * botCluster.count());

      bot = botCluster.getBot(index);

      if (
        !(await bot.hasCheckMaxUse(
          RandomStrategy.name,
          botCluster.getChatId()
        )) ||
        !(await bot.checkCounter(RandomStrategy.name, botCluster.getChatId()))
      ) {
        break;
      }

      attempt++;
    }

    return bot;
  }

  private async hasWeightRandom(
    botCluster: BotClusterInterface
  ): Promise<BotInterface | null> {
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
        !(await bot.hasCheckMaxUse(
          RandomStrategy.name,
          botCluster.getChatId()
        )) ||
        !(await bot.checkCounter(RandomStrategy.name, botCluster.getChatId()))
      ) {
        break;
      }

      attempt++;
    }

    return bot;
  }

  private async noWeightRandom(
    botCluster: BotClusterInterface
  ): Promise<BotInterface | null> {
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
        !(await bot.hasCheckMaxUse(
          RandomStrategy.name,
          botCluster.getChatId()
        )) ||
        !(await bot.checkCounter(RandomStrategy.name, botCluster.getChatId()))
      ) {
        break;
      }

      attempt++;
    }

    return bot;
  }
}
