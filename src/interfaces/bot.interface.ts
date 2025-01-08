export interface BotInterface {
  readonly name: string;
  readonly weight: number;
  readonly max_use?: number | null;
  readonly max_wait_use?: number | null;
  readonly max_fail: number;
  readonly fail_time_out_second?: number;
}
