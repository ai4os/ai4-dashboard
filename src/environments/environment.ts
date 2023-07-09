import { endpoints } from './endpoints';

export const environment = {
    name: 'prod',
    develop: true,
    production: true,
    api: {
      base: 'https://api.dev.ai4eosc.eu/v1',
      clusterBase: 'http://localhost:3000',
      endpoints,
    },
};
