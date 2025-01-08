import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map, Observable } from 'rxjs';
import {
  TelegramResponse,
  TelegramUser,
} from './interfaces/telegram.interface';
import { AxiosRequestConfig } from 'axios';
import { HttpService } from '@nestjs/axios';
import { TelegramRequestException } from './exceptions/telegram-request.exception';
import { PickBot } from './pick-bot';
import { RandomStrategy } from './strategies/random.strategy';
import { InputRandomStrategyEnum } from './enums/input-random-strategy.enum';
import { BotCluster } from './bot.cluster';
import { Bot } from './bot';

@Injectable()
export class TelegramService {
  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService
  ) {}

  public test() {
    const pickBot: PickBot = new PickBot(
      new RandomStrategy(InputRandomStrategyEnum.NO_WEIGHT)
    );
    const clusterBots: BotCluster = new BotCluster('testCluster', [
      new Bot('bot1', 1),
      new Bot('bot2'),
      new Bot('bot3'),
      new Bot('bot4', 2),
      new Bot('bot5'),
    ]);

    // console.log(pickBot, clusterBots);

    console.log(pickBot.pick(clusterBots).name);
    console.log(pickBot.pick(clusterBots).name);
  }

  public getMe(): Observable<TelegramUser> {
    return this.handleRequest<TelegramUser>(
      this.configService.get('telegram.getMe')
    );
  }

  private getBotKey(): string {
    return '';
  }

  private handleRequest<T>(
    endpoint: string,
    data: object = {},
    axiosOptions?: AxiosRequestConfig
  ): Observable<T> {
    const rootUrl: string = this.configService.get<string>('telegram.url');
    const apiUrl: string = `${rootUrl}${this.getBotKey()}/${endpoint}`;
    return this.http.post<TelegramResponse<T>>(apiUrl, data, axiosOptions).pipe(
      map((res: any) => {
        if (!res.data.ok) {
          throw new TelegramRequestException(res.data.description);
        }
        return res.data.result;
      }),
      catchError((error: Error) => {
        throw new TelegramRequestException(error.message);
      })
    );
  }
}
