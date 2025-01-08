import { registerAs } from "@nestjs/config";
import { TelegramConfigType } from "./telegram.config.type";

export default registerAs<TelegramConfigType>('telegram', () => {
  return {
    url: 'https://api.telegram.org',
    endpointBot: '/bot'
  }
})