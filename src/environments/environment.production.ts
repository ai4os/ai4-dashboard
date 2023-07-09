import { endpoints } from './endpoints';

export const environment = {
  name: 'prod',
  develop: false,
  production: true,
  api: {
    base: 'https://api.cloud.ai4eosc.eu/v1',
    clusterBase: 'http://localhost:3000',
    endpoints,
  },
};
