export interface BotInterface {
  index: number;
  readonly name: string;
  readonly weight: number;
  readonly maxUse?: number | null;
  readonly maxWaitUse?: number | null;
  readonly maxFail: number;
  readonly failTimeOutSecond?: number;

  checkCounter(
    className: string,
    chatId: string | number | undefined
  ): Promise<boolean>;

  hasCheckMaxUse(
    className: string,
    chatId: string | number | undefined
  ): Promise<boolean>;

  counterCheck(
    className: string,
    chatId: string | number | undefined
  ): Promise<void>;

  getWeight(): number;

  setCacheProvide(cacheService?: any): void;
}
