import { endpoints } from './endpoints';

export const environment = {
  name: 'prod',
  develop: true,
  production: false,
  api: {
    base: 'https://api.cloud.ai4eosc.eu/v1',
    endpoints,
  },
};
