import { of } from 'rxjs';

export const mockedHuggingFaceService = {
    validateOAuthRedirect: jest.fn().mockReturnValue(of(undefined)),
};
