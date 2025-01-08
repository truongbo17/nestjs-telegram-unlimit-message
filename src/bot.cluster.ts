import { BotClusterInterface, BotInterface } from './interfaces';

export class BotCluster implements BotClusterInterface {
  bots: BotInterface[];
  readonly cluster_name: string;

  count(): number {
    return 0;
  }

  getBot(index: number): BotInterface {
    return undefined;
  }

  isEmpty(): boolean {
    return false;
  }

  sort(type: string): this {
    return undefined;
  }
}
