import {
  BotClusterInterface,
  BotInterface,
  StrategyInterface,
} from '../interfaces';
import { EmptyBotException } from '../exceptions/empty-bot.exception';
import { MAX_RETRIES } from '../constants/random-strategy.constant';

export class RoundRobinStrategy implements StrategyInterface {
  constructor(private counter: number = 0) {}

  getBot(botCluster: BotClusterInterface): BotInterface | null {
    if (botCluster.isEmpty()) {
      throw new EmptyBotException();
    }

    let bot: BotInterface | null = null;
    const maxRetries: number = MAX_RETRIES;
    let attempt: number = 0;

    while (attempt < maxRetries) {
      const index: number = this.counter++ % botCluster.count();

      bot = botCluster.getBot(index);

      if (
        !bot.hasCheckMaxUse(RoundRobinStrategy.name) ||
        !bot.checkCounter(RoundRobinStrategy.name)
      ) {
        break;
      }

      attempt++;
    }
    return bot;
  }
}
