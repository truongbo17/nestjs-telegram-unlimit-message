import {
  BotClusterInterface,
  BotInterface,
  StrategyInterface,
} from '../interfaces';
import { EmptyBotException } from '../exceptions/empty-bot.exception';

export class WeightedRoundRobinStrategy implements StrategyInterface {
  private counterBotWeight: number = 0;
  private indexBotWeight: number | null = null;

  constructor(private counter: number = 0) {}

  getBot(botCluster: BotClusterInterface): BotInterface | null {
    if (botCluster.isEmptyBotNoWeight()) {
      throw new EmptyBotException();
    }

    if (this.counterBotWeight < 1) {
      const index: number = this.counter++ % botCluster.countBotHasWeight();

      const bot: BotInterface = botCluster.getBotHasWeight(index);

      if (bot.getWeight() > 1) {
        this.counterBotWeight = bot.getWeight() - 1;
        this.indexBotWeight = index;
      } else {
        return bot;
      }
    } else {
      this.counterBotWeight--;
    }
    return botCluster.getBotHasWeight(this.indexBotWeight);
  }
}
