import { registerAs } from '@nestjs/config';
import { TelegramConfigType } from './telegram.config.type';

export default registerAs<TelegramConfigType>('telegram', () => {
  return {
    url: 'https://api.telegram.org/bot',
    getMe: '/getMe',
    sendMessage: '/sendMessage',
    forwardMessage: '/forwardMessage',
    sendPhoto: '/sendPhoto',
    sendAudio: '/sendAudio',
    sendDocument: '/sendDocument',
    sendSticker: '/sendSticker',
    sendVideo: '/sendVideo',
    sendVoice: '/sendVoice',
    sendLocation: '/sendLocation',
  };
});
