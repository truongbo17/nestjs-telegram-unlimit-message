import { BotClusterInterface, BotInterface } from './interfaces';
import { SortBotEnum } from './enums';

export class BotCluster implements BotClusterInterface {
  allBots: BotInterface[];
  botHasWeight: BotInterface[];
  botNoWeight: BotInterface[];

  constructor(
    readonly bots: BotInterface[],
    private readonly chatId?: string | number,
    cacheService?: any
  ) {
    this.allBots = bots;
    this.botNoWeight = [];
    this.botHasWeight = [];

    this.handleWeight(cacheService);
  }

  public getChatId(): string | number | undefined {
    return this.chatId;
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

  private handleWeight(cacheService?: any): void {
    this.bots.forEach((bot: BotInterface, index: number) => {
      bot.index = index;

      if (cacheService) {
        bot.setCacheProvide(cacheService);
      }

      if (bot.weight > 0) {
        this.botHasWeight.push(bot);
      } else {
        this.botNoWeight.push(bot);
      }
    });
  }
}
