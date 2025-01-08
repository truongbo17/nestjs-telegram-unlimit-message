import { TelegramUnlimitedMessageException } from './telegram-unlimited-message.exception';

export class TelegramNotBotKeyException extends TelegramUnlimitedMessageException {
  constructor(
    message: string = 'Please config cluster bot and strategy pick bot.'
  ) {
    super(message);
  }
}
