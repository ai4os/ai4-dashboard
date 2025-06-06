import { of } from 'rxjs';
import {
    PlatformStatus,
    StatusNotification,
} from '../../interfaces/platform-status.interface';

export const mockedPlatformStatusNotifications: PlatformStatus[] = [
    {
        labels: [{ name: 'dashboard-popup' }],
        id: 0,
        title: 'Test Notification',
    },
    {
        labels: [{ name: 'nomad-maintenance' }],
        id: 1,
        title: 'Warning: Nomad Cluster Maintenance',
    },
    {
        labels: [{ name: 'unrelated-label' }],
        id: 2,
        title: 'Unrelated Notification',
    },
];

export const mockedStatusNotifications: StatusNotification[] = [
    {
        title: 'Test Notification',
        vo: 'vo-ai4eosc.eu',
        summary: 'Test Summary',
        start: new Date('2023-01-01'),
        end: new Date('2023-01-02'),
        downtimeStart: new Date('2023-01-01T10:00:00Z'),
        downtimeEnd: new Date('2023-01-01T12:00:00Z'),
        datacenters: ['DC1', 'DC2'],
    },
];

export const mockedPlatformStatusService = {
    getPlatformNotifications: jest
        .fn()
        .mockReturnValue(of(mockedPlatformStatusNotifications)),
    filterByDateAndVo: jest.fn().mockReturnValue(mockedStatusNotifications),
    getMaintenanceInfo: jest.fn().mockReturnValue('Maintenance info'),
};
