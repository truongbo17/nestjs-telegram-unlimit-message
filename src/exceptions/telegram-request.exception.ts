import { TelegramUnlimitedMessageException } from './telegram-unlimited-message.exception';

export class TelegramRequestException extends TelegramUnlimitedMessageException {
  constructor(message: string = 'Telegram request has exception.') {
    super(message);
  }
}
