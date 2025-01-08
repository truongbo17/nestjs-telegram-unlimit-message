import { registerAs } from '@nestjs/config';
import { ApiConfigType } from './api.config.type';

export default registerAs<ApiConfigType>('api', () => {
  return {
    timeout: 10000,
    maxRedirects: 0,
  };
});
