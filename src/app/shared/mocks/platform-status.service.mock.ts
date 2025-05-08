import { of } from 'rxjs';
import { PlatformStatus } from '../interfaces/platform-status.interface';

export const mockedPlatformStatusNotifications: PlatformStatus[] = [
    {
        id: 0,
        title: 'Test Notification',
        labels: [],
    },
];

export const mockedPlatformStatusService = {
    getPlatformNotifications: jest
        .fn()
        .mockReturnValue(of(mockedPlatformStatusNotifications)),
    filterByDateAndVo: jest.fn(),
};
