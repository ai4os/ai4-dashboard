import { endpoints } from './endpoints';

export const environment = {
    name: 'prod',
    develop: false,
    production: true,
    api: {
        base: '127.0.0.1:3000',
        endpoints,
    },
};
