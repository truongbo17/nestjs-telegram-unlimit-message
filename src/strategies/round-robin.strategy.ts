import {
  BotClusterInterface,
  BotInterface,
  StrategyInterface,
} from '../interfaces';
import { EmptyBotException } from '../exceptions/empty-bot.exception';
import { MAX_RETRIES } from '../constants/random-strategy.constant';

export class RoundRobinStrategy implements StrategyInterface {
  private chatIdCounters: Map<string, number>;

  constructor(private counter: number = 0) {
    this.chatIdCounters = new Map<string, number>();
  }

  getBot(botCluster: BotClusterInterface): BotInterface | null {
    if (botCluster.isEmpty()) {
      throw new EmptyBotException();
    }

    let bot: BotInterface | null = null;
    const maxRetries: number = MAX_RETRIES;
    let attempt: number = 0;

    while (attempt < maxRetries) {
      let idCounter: number =
        this.chatIdCounters.get(botCluster.getChatId() as string) ||
        this.counter;
      const index: number = idCounter++ % botCluster.count();
      this.chatIdCounters.set(botCluster.getChatId() as string, idCounter);

      bot = botCluster.getBot(index);

      if (
        !bot.hasCheckMaxUse(RoundRobinStrategy.name, botCluster.getChatId()) ||
        !bot.checkCounter(RoundRobinStrategy.name, botCluster.getChatId())
      ) {
        break;
      }

      attempt++;
    }
    return bot;
  }
}
