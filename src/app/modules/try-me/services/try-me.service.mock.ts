import {
    GradioCreateResponse,
    GradioDeployment,
} from '@app/shared/interfaces/module.interface';
import { of } from 'rxjs';

export const createGradioDeploymentResponse: GradioCreateResponse = {
    status: 'success',
    job_ID: '700a0060-904e-11ef-a9af-67eed56a1e49',
};

export const gradioDeployments: GradioDeployment[] = [
    {
        job_ID: '9d7c8b08-904e-11ef-a9af-67eed56a1e49',
        name: 'try-9d7c8b08-904e-11ef-a9af-67eed56a1e49',
        status: 'running',
        owner: 'test@egi.eu',
        title: 'pink_butterfly',
        description: '',
        docker_image: 'ai4oshub/dogs-breed-detector:latest',
        docker_command: 'deep-start --deepaas',
        submit_time: '2024-10-22 10:21:19',
        resources: {
            cpu_MHz: 2000,
            cpu_num: 1,
            disk_MB: 300,
            gpu_num: 0,
            memory_MB: 2000,
        },
        endpoints: {
            ui: 'http://ui-9d7c8b08-904e-11ef-a9af-67eed56a1e49.ifca-deployments.cloud.ai4eosc.eu',
        },
        active_endpoints: [],
        main_endpoint: 'ui',
        alloc_ID: '10d8b329-0ea4-97ed-4269-2493775274ec',
        datacenter: 'ifca-test',
    },
    {
        job_ID: '9d7c8b08-904e-11ef-a9af-67eed56a1e44',
        name: 'try-9d7c8b08-904e-11ef-a9af-67eed56a1e44',
        status: 'running',
        owner: 'test@egi.eu',
        title: 'blue_whale',
        description: '',
        docker_image: 'ai4oshub/dogs-breed-detector:latest',
        docker_command: 'deep-start --deepaas',
        submit_time: '2024-10-22 10:21:19',
        resources: {
            cpu_MHz: 2000,
            cpu_num: 1,
            disk_MB: 300,
            gpu_num: 0,
            memory_MB: 2000,
        },
        endpoints: {
            ui: 'http://ui-9d7c8b08-904e-11ef-a9af-67eed56a1e49.ifca-deployments.cloud.ai4eosc.eu',
        },
        active_endpoints: [],
        main_endpoint: 'ui',
        alloc_ID: '10d8b329-0ea4-97ed-4269-2493775274ec',
        datacenter: 'ifca-test',
    },
];

const mockGradioDeployments: GradioDeployment[] = [
    {
        job_ID: 'try-me-123',
        name: 'Test Deployment',
        status: 'running',
        owner: 'TestUser',
        title: 'Test Deployment',
        description: 'This is a test deployment',
        docker_image: 'test/image',
        docker_command: 'test command',
        submit_time: '2023-10-01T00:00:00Z',
        resources: {
            cpu_num: 5,
            cpu_MHz: 3000,
            gpu_num: 1,
            memory_MB: 600,
            disk_MB: 6000,
        },
        endpoints: {
            ui: 'http://test-ui.com',
        },
        active_endpoints: [],
        main_endpoint: '',
        alloc_ID: '',
        datacenter: '',
    },
];

export const mockedTryMeService = {
    createDeploymentGradio: jest.fn().mockReturnValue(
        of({
            status: 'success',
            job_ID: '123',
        })
    ),
    getDeploymentGradioByUUID: jest
        .fn()
        .mockReturnValue(of(mockGradioDeployments[0])),
};
