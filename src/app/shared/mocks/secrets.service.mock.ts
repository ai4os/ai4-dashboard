import { of } from 'rxjs';

export const mockedSecrets = {
    '/deployments/1234/federated/default': { token: '1234' },
};

export const mockedSecretsService = {
    getSecrets: jest.fn().mockReturnValue(of(mockedSecrets)),
    createSecret: jest.fn().mockReturnValue(of({ status: 'success' })),
    deleteSecret: jest.fn().mockReturnValue(of({ status: 'success' })),
};
