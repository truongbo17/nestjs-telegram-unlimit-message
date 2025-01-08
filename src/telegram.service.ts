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

@Injectable()
export class TelegramService {
  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService
  ) {}

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
