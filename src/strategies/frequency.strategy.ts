import {
  BotClusterInterface,
  BotInterface,
  StrategyInterface,
} from '../interfaces';
import { EmptyBotException } from '../exceptions/empty-bot.exception';
import { MAX_RETRIES } from '../constants/random-strategy.constant';

export class FrequencyStrategy implements StrategyInterface {
  constructor(
    private readonly frequency: number = 0.8,
    private readonly depth: number = 0.2
  ) {}

  public getBot(botCluster: BotClusterInterface): BotInterface | null {
    if (botCluster.isEmpty()) {
      throw new EmptyBotException();
    }

    let bot: BotInterface | null = null;
    const maxRetries: number = MAX_RETRIES;
    let attempt: number = 0;

    while (attempt < maxRetries) {
      const total: number = botCluster.count();
      const low: number = Math.ceil(this.depth * total);
      const high: number = low + (total > 1 ? 1 : 0);

      const index: number = this.isChance(this.frequency)
        ? Math.floor(Math.random() * low) + 1
        : Math.floor(Math.random() * (total - high + 1)) + high;

      bot = botCluster.getBot(index);

      if (
        !bot.hasCheckMaxUse(FrequencyStrategy.name, botCluster.getChatId()) ||
        !bot.checkCounter(FrequencyStrategy.name, botCluster.getChatId())
      ) {
        break;
      }

      attempt++;
    }

    return bot;
  }

  private isChance(frequency: number): boolean {
    return frequency * 100 >= Math.random() * 100 + 1;
  }
}
