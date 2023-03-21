import { endpoints } from './endpoints';

export const environment = {
  name: 'prod',
  develop: false,
  production: true,
  api: {
    base: '/api',
    endpoints,
  },
};
