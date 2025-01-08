import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map, Observable } from 'rxjs';
import {
  TelegramMessage,
  TelegramResponse,
  TelegramSendMessageParams,
  TelegramUser,
} from './interfaces/telegram.interface';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { HttpService } from '@nestjs/axios';
import { TelegramRequestException } from './exceptions/telegram-request.exception';
import { TELEGRAM_MODULE_PROVIDER } from './constants/telegram.constant';
import { TelegramModuleOptions } from './interfaces/telegram-module-option.interface';
import { TelegramNotBotKeyException } from './exceptions/telegram-not-bot-key.exception';
import { BotClusterInterface, PickBotInterface } from './interfaces';
import { TelegramUnlimitedMessageException } from './exceptions/telegram-unlimited-message.exception';
import { PickBot } from './pick-bot';
import { BotCluster } from './bot.cluster';

@Injectable()
export class TelegramService {
  constructor(
    @Inject(TELEGRAM_MODULE_PROVIDER)
    private readonly options: TelegramModuleOptions,
    private readonly http: HttpService,
    private readonly configService: ConfigService
  ) {}

  public getMe(): Observable<TelegramUser> {
    return this.handleRequest<TelegramUser>(
      this.configService.get('telegram.getMe')
    );
  }

  public sendMessage(
    data: TelegramSendMessageParams
  ): Observable<TelegramMessage> {
    return this.handleRequest<TelegramMessage>(
      this.configService.get('telegram.sendMessage'),
      data
    );
  }

  private getBotKey(): string | void {
    if (!this.options.strategy || !this.options.bots) {
      throw new TelegramNotBotKeyException();
    }

    const pickBot: PickBotInterface = new PickBot(this.options.strategy);
    const clusterBots: BotClusterInterface = new BotCluster(this.options.bots);

    const key: string = pickBot.pick(clusterBots).name;
    if (!key) {
      throw new TelegramUnlimitedMessageException(
        'Strategy not has key, please try again.'
      );
    }

    return key;
  }

  private handleRequest<T>(
    endpoint: string,
    data: object = {},
    axiosOptions?: AxiosRequestConfig
  ): Observable<T> {
    const rootUrl: string = this.configService.get<string>('telegram.url');
    const apiUrl: string = `${rootUrl}${this.getBotKey()}${endpoint}`;
    return this.http.post<TelegramResponse<T>>(apiUrl, data, axiosOptions).pipe(
      map((res: any) => {
        if (!res.data.ok) {
          throw new TelegramRequestException(res.data.description);
        }
        return res.data.result;
      }),
      catchError((error: Error) => {
        if (error instanceof AxiosError) {
          throw new TelegramRequestException(
            error?.response?.data?.description || error.message
          );
        }
        throw new TelegramRequestException(error.message);
      })
    );
  }
}
