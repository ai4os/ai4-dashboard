import { endpoints } from './endpoints';

export const environment = {
    name: 'dev',
    develop: true,
    production: false,
    api: {
      base: 'https://api.dev.imagine-ai.eu',
      endpoints,
    },
};
