import { endpoints } from './endpoints';

export const environment = {
    name: 'production',
    develop: false,
    production: true,
    api: { base: 'https://api.cloud.ai4eosc.eu/v1', endpoints },
    huggingFaceClientSecret: '',
};
