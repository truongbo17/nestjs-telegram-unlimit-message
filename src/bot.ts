import { BotInterface } from './interfaces';
import { InputMaxUserBotException } from './exceptions/input-max-user-bot.exception';
import NodeCache from 'node-cache';
import { CacheCounterBotType } from './types/cache-counter-bot.type';
import moment from 'moment';
import {
  CACHE_TTL_SECOND,
  MIN_USE,
  START_COUNTER,
} from './constants/bot.constant';

export class Bot implements BotInterface {
  private readonly cache: NodeCache = new NodeCache();

  constructor(
    public readonly name: string,
    public readonly weight: number = 0,
    public readonly maxUse: number | null = null,
    public readonly maxWaitUse: number | null = null,
    public readonly maxFail: number = 10,
    public readonly failTimeOutSecond: number = 90
  ) {
    if (
      !this.maxFail &&
      this.maxUse < MIN_USE &&
      !this.maxWaitUse &&
      this.maxWaitUse < MIN_USE
    ) {
      throw new InputMaxUserBotException();
    }
  }

  public hasCheckMaxUse(className: string): boolean {
    if (this.maxUse !== null && this.maxWaitUse !== null) {
      this.counter(className);
      return true;
    }
    return false;
  }

  public checkCounter(className: string): boolean {
    const botCounter: CacheCounterBotType | undefined = this.cache.get(
      `${className}_${this.name}`
    );

    if (botCounter && botCounter.counter >= this.maxUse) {
      if (!botCounter.time) {
        const waitTime: string = moment()
          .add(this.maxWaitUse, 'seconds')
          .toISOString();

        this.cache.set(
          `${className}_${this.name}`,
          {
            counter: botCounter.counter,
            time: waitTime,
          },
          CACHE_TTL_SECOND
        );
      } else if (moment(botCounter.time).isBefore(moment())) {
        this.cache.del(`${className}_${this.name}`);
        return false;
      }
      return true;
    }
    return false;
  }

  private counter(className: string): void {
    const botCounter: CacheCounterBotType = this.cache.get(
      `${className}_${this.name}`
    ) || {
      counter: START_COUNTER,
      time: null,
    };

    const updatedData: CacheCounterBotType = {
      counter: Number(botCounter.counter || START_COUNTER) + 1,
      time: botCounter.time,
    };

    this.cache.set(`${className}_${this.name}`, updatedData, CACHE_TTL_SECOND);
  }
}
