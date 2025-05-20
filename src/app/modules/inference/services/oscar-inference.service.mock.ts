import { get } from 'ol/proj';
import { of } from 'rxjs';
import { OscarService } from '../../../shared/interfaces/oscar-service.interface';

export const mockedOscarServices: OscarService[] = [
    {
        token: 'mock-token',
        storage_providers: {
            minio: {
                default: {
                    access_key: 'mock-access-key',
                    secret_key: 'mock-secret-key',
                    endpoint: '',
                    region: '',
                    verify: false,
                },
            },
        },
        environment: {
            variables: {
                PAPI_TITLE: 'Oscar Service Mock Title',
                PAPI_DESCRIPTION: 'Mock Description',
                PAPI_CREATED: '2023-01-01T00:00:00Z',
            },
        },
        name: '',
        title: '',
        owner: '',
        memory: '',
        cpu: '',
        total_memory: '',
        total_cpu: '',
        image: '',
        endpoint: '',
        submit_time: '',
    },
    {
        token: 'mock-token',
        storage_providers: {
            minio: {
                default: {
                    access_key: 'mock-access-key',
                    secret_key: 'mock-secret-key',
                    endpoint: '',
                    region: '',
                    verify: false,
                },
            },
        },
        environment: {
            variables: {
                PAPI_TITLE: 'Mock Title 2',
                PAPI_DESCRIPTION: 'Mock Description',
                PAPI_CREATED: '2023-01-01T00:00:00Z',
            },
        },
        name: '',
        title: '',
        owner: '',
        memory: '',
        cpu: '',
        total_memory: '',
        total_cpu: '',
        image: '',
        endpoint: '',
        submit_time: '',
    },
];

export const mockedOscarInferenceService = {
    getServiceByName: jest.fn().mockReturnValue(of(mockedOscarServices[0])),
    getServices: jest.fn().mockReturnValue(of(mockedOscarServices)),
    deleteServiceByName: jest.fn().mockReturnValue(of('mock-uuid')),
    createService: jest.fn().mockReturnValue(of('mock-uuid')),
};
