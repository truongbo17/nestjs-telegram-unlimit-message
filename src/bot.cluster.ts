import { BotClusterInterface, BotInterface } from './interfaces';
import { SortBotEnum } from './enums/sort-bot.enum';

export class BotCluster implements BotClusterInterface {
  allBots: BotInterface[];
  botHasWeight: BotInterface[];
  botNoWeight: BotInterface[];

  constructor(
    private readonly cluster_name: string,
    readonly bots: BotInterface[]
  ) {
    this.allBots = bots;
    this.botNoWeight = [];
    this.botHasWeight = [];

    this.handleWeight();
  }

  public getBotHasWeight(index: number): BotInterface | null {
    return this.botHasWeight?.[index] ?? null;
  }

  public getBotNoWeight(index: number): BotInterface | null {
    return this.botNoWeight?.[index] ?? null;
  }

  public isEmptyBotHasWeight(): boolean {
    return this.botHasWeight.length < 1;
  }

  public isEmptyBotNoWeight(): boolean {
    return this.botNoWeight.length < 1;
  }

  public countBotHasWeight(): number {
    return this.botHasWeight.length;
  }

  public countBotNoWeight(): number {
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
