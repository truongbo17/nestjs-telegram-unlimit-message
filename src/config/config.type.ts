import { TelegramConfigType } from './telegram.config.type';
import { ApiConfigType } from './api.config.type';

export type ConfigType = {
  telegram: TelegramConfigType;
  api: ApiConfigType;
};
