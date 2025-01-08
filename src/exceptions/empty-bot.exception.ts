import { TelegramUnlimitedMessageException } from './telegram-unlimited-message.exception';

export class EmptyBotException extends TelegramUnlimitedMessageException {
  constructor(message: string = 'Cluster must have at least one bot.') {
    super(message);
  }
}
