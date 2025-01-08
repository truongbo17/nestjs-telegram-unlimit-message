import { BotInterface } from './bot.interface';

export interface BotClusterInterface {
  readonly cluster_name: string;
  bots: BotInterface[];

  isEmpty(): boolean;

  getBot(index: number): BotInterface;

  count(): number;

  sort(type: string): this;
}
