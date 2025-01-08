import { TelegramUnlimitedMessageException } from './telegram-unlimited-message.exception';

export class InputMaxUserBotException extends TelegramUnlimitedMessageException {
  constructor(
    message: string = 'maxUse & maxWaitUse of Bot must be greater than 1.'
  ) {
    super(message);
  }
}
