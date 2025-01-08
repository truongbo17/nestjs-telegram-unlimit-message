import { BotInterface } from './interfaces';
import { InputMaxUserBotException } from './exceptions/input-max-user-bot.exception';

export class Bot implements BotInterface {
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
      this.maxUse < 2 &&
      !this.maxWaitUse &&
      this.maxWaitUse < 2
    ) {
      throw new InputMaxUserBotException();
    }
  }
}
