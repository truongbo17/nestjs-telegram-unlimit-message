import { BotInterface } from './interfaces';
import { InputMaxUserBotException } from './exceptions/input-max-user-bot.exception';
import { CacheCounterBotType } from './types/cache-counter-bot.type';
import moment from 'moment';
import {
  CACHE_TTL_SECOND,
  MIN_USE,
  START_COUNTER,
} from './constants/bot.constant';
import NodeCache from 'node-cache';

export class Bot implements BotInterface {
  private cache: any;

  constructor(
    public readonly name: string,
    public readonly weight: number = 0,
    public readonly maxUse: number | null = null,
    public readonly maxWaitUse: number | null = null,
    public readonly maxFail: number = 10,
    public readonly failTimeOutSecond: number = 90,
    public readonly index: number = 0
  ) {
    if (
      !this.maxFail &&
      this.maxUse < MIN_USE &&
      !this.maxWaitUse &&
      this.maxWaitUse < MIN_USE
    ) {
      throw new InputMaxUserBotException();
    }

    this.cache = new NodeCache();
  }

  public setCacheProvide(cacheService?: any): void {
    if (cacheService) {
      this.cache = cacheService;
    }
  }

  public async hasCheckMaxUse(
    className: string,
    chatId: string | number | undefined
  ): Promise<boolean> {
    if (this.maxUse !== null && this.maxWaitUse !== null) {
      await this.counterCheck(className, chatId);
      return true;
    }
    return false;
  }

  public async checkCounter(
    className: string,
    chatId: string | number | undefined
  ): Promise<boolean> {
    let cacheKey: string = `${className}_${this.name}`;
    if (chatId) {
      cacheKey = `${cacheKey}_${chatId}`;
    }

    const botCounter: CacheCounterBotType | undefined =
      await this.cache.get(cacheKey);

    if (botCounter && botCounter.counter >= this.maxUse) {
      if (!botCounter.time) {
        const waitTime: string = moment()
          .add(this.maxWaitUse, 'seconds')
          .toISOString();

        await this.cache.set(
          cacheKey,
          {
            counter: botCounter.counter,
            time: waitTime,
          },
          CACHE_TTL_SECOND
        );
      } else if (moment(botCounter.time).isBefore(moment())) {
        await this.cache.del(cacheKey);
        return false;
      }
      return true;
    }
    return false;
  }

  public getWeight(): number {
    return this.weight;
  }

  async counterCheck(
    className: string,
    chatId: string | number | undefined
  ): Promise<void> {
    let cacheKey: string = `${className}_${this.name}`;
    if (chatId) {
      cacheKey = `${cacheKey}_${chatId}`;
    }
    const botCounter: CacheCounterBotType = (await this.cache.get(
      cacheKey
    )) || {
      counter: START_COUNTER,
      time: null,
    };

    const updatedData: CacheCounterBotType = {
      counter: Number(botCounter.counter || START_COUNTER) + 1,
      time: botCounter.time,
    };

    await this.cache.set(cacheKey, updatedData, CACHE_TTL_SECOND);
  }
}
