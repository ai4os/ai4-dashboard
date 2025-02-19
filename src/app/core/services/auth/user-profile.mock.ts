import { UserProfile } from './auth.service';

export const mockedUserProfile: UserProfile = {
    name: 'AI4EOSC Dashboard Test',
    email: 'test@ifca.unican.es',
    group_membership: [
        '/Demo Access',
        '/EGI',
        '/IFCA',
        '/Developer Access/vo.ai4eosc.eu',
        '/Platform Access/vo.ai4eosc.eu',
        '/Developer Access/vo.imagine-ai.eu',
        '/Platform Access/vo.imagine-ai.eu',
    ],
    isAuthorized: true,
    isDeveloper: true,
};
