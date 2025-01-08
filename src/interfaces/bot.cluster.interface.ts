import { BotInterface } from './bot.interface';
import { SortBotEnum } from '../enums/sort-bot.enum';

export interface BotClusterInterface {
  allBots: BotInterface[];
  botHasWeight: BotInterface[];
  botNoWeight: BotInterface[];

  isEmpty(): boolean;

  getBot(index: number): BotInterface;

  count(): number;

  sort(type: SortBotEnum): this;
}
