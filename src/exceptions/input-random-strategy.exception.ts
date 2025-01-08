import { TelegramUnlimitedMessageException } from './telegram-unlimited-message.exception';

export class InputRandomStrategyException extends TelegramUnlimitedMessageException {
  constructor(message: string = 'Input random strategy invalid.') {
    super(message);
  }
}
