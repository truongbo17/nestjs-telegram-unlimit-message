import {
  BotClusterInterface,
  BotInterface,
  StrategyInterface,
} from '../interfaces';
import { EmptyBotException } from '../exceptions/empty-bot.exception';
import { MAX_RETRIES } from '../constants/random-strategy.constant';

export class WeightedRoundRobinStrategy implements StrategyInterface {
  private counterBotWeight: number = 0;
  private indexBotWeight: number | null = null;
  private chatIdCounters: Map<string, number>;

  constructor(private counter: number = 0) {
    this.chatIdCounters = new Map<string, number>();
  }

  public async getBot(
    botCluster: BotClusterInterface
  ): Promise<BotInterface | null> {
    if (botCluster.isEmptyBotNoWeight()) {
      throw new EmptyBotException();
    }

    let bot: BotInterface | null = null;
    const maxRetries: number = MAX_RETRIES;
    let attempt: number = 0;

    while (attempt < maxRetries) {
      if (this.counterBotWeight < 1) {
        let idCounter: number =
          this.chatIdCounters.get(botCluster.getChatId() as string) ||
          this.counter;
        const index: number = idCounter++ % botCluster.countBotHasWeight();
        this.chatIdCounters.set(botCluster.getChatId() as string, idCounter);

        bot = botCluster.getBotHasWeight(index);

        if (bot.getWeight() > 1) {
          this.counterBotWeight = bot.getWeight() - 1;
          this.indexBotWeight = index;
        } else {
          return bot;
        }
      } else {
        this.counterBotWeight--;
      }
      bot = botCluster.getBotHasWeight(this.indexBotWeight);

      if (
        !(await bot.hasCheckMaxUse(
          WeightedRoundRobinStrategy.name,
          botCluster.getChatId()
        )) ||
        !(await bot.checkCounter(
          WeightedRoundRobinStrategy.name,
          botCluster.getChatId()
        ))
      ) {
        break;
      }

      attempt++;
    }
    return bot;
  }
}
