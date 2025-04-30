import { BehaviorSubject } from 'rxjs';

const mockedUserProfile = new BehaviorSubject({});

export const mockedAuthService: any = {
    analytics: {
        domain: 'localhost',
        src: 'http://locahost/js/script.js',
    },
    isAuthenticated: jest.fn(),
    userProfileSubject: mockedUserProfile,
    getValue: jest.fn(() => mockedUserProfile.getValue()),
    login: jest.fn(),
    logout: jest.fn(),
    loadUserProfile: jest
        .fn()
        .mockReturnValue(Promise.resolve(mockedUserProfile)),
    isDoneLoading$: new BehaviorSubject<boolean>(false),
};
