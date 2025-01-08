export interface BotInterface {
  readonly name: string;
  readonly weight: number;
  readonly maxUse?: number | null;
  readonly maxWaitUse?: number | null;
  readonly maxFail: number;
  readonly failTimeOutSecond?: number;
}
