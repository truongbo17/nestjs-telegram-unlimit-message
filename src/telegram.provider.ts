import { Provider } from '@nestjs/common';
import { TelegramModuleOptions } from './interfaces/telegram-module-option.interface';
import { TELEGRAM_MODULE_PROVIDER } from './constants/telegram.constant';

export function createTelegramProvider(
  options: TelegramModuleOptions
): Provider[] {
  return [
    {
      provide: TELEGRAM_MODULE_PROVIDER,
      useValue: options || {},
    },
  ];
}
