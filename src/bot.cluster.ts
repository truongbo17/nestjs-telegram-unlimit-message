import { BotClusterInterface, BotInterface } from './interfaces';
import { SortBotEnum } from './enums/sort-bot.enum';

export class BotCluster implements BotClusterInterface {
  allBots: BotInterface[];
  botHasWeight: BotInterface[];
  botNoWeight: BotInterface[];

  constructor(
    readonly bots: BotInterface[],
    private readonly cluster_name: string
  ) {
    this.allBots = bots;
    this.handleWeight();
  }

  public getNodeHasWeight(index: number): BotInterface | null {
    return this.botHasWeight?.[index] ?? null;
  }

  public getNodeNoWeight(index: number): BotInterface | null {
    return this.botNoWeight?.[index] ?? null;
  }

  public isEmptyNodeHasWeight(): boolean {
    return this.botHasWeight.length < 1;
  }

  public isEmptyNodeNoWeight(): boolean {
    return this.botNoWeight.length < 1;
  }

  public countNodeHasWeight(): number {
    return this.botHasWeight.length;
  }

  public countNodeNoWeight(): number {
    return this.botNoWeight.length;
  }

  count(): number {
    return this.allBots.length;
  }

  getBot(index: number): BotInterface {
    return this.allBots[index];
  }

  isEmpty(): boolean {
    return this.allBots.length < 1;
  }

  sort(type: SortBotEnum): this {
    switch (type) {
      case SortBotEnum.ASC:
      case SortBotEnum.DESC:
    }

    return this;
  }

  private handleWeight(): void {
    this.bots.forEach((bot: BotInterface) => {
      if (bot.weight > 0) {
        this.botHasWeight.push(bot);
      } else {
        this.botNoWeight.push(bot);
      }
    });
  }
}
