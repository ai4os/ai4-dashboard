import { endpoints } from './endpoints';

export const environment = {
    name: 'prod',
    develop: false,
    production: true,
    api: {
        base: 'https://api1.dev.ai4eosc.eu/v1',
        endpoints,
    },
};
