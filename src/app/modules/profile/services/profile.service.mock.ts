import { of } from 'rxjs';
import { StorageCredential } from '../../../shared/interfaces/profile.interface';

export const mockedCredentials: StorageCredential[] = [
    {
        vendor: 'test',
        server: 'nextcloud',
        loginName: 'test',
        appPassword: 'pass',
    },
];

export const mockedNewCredential: StorageCredential = {
    vendor: 'new-credential-test',
    server: 'dropbox',
    loginName: 'test',
    appPassword: 'pass',
};

export const mockedProfileService = {
    validateOAuthRedirect: jest.fn().mockReturnValue(of({})),
    loginWithHuggingFace: jest.fn().mockReturnValue(of({})),
};
