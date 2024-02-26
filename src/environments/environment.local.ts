import { endpoints } from './endpoints';

export const environment = {
    name: 'dev',
    develop: true,
    production: false,
    api: {
        base: 'http://localhost:8000/v1',
        clusterBase: 'http://localhost:3000',
        endpoints,
    },
};
