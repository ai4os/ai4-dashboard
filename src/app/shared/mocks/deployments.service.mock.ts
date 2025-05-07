import { of } from 'rxjs';
import { Deployment, StatusReturn } from '../interfaces/deployment.interface';

export const mockedDeployment: Deployment = {
    job_ID: 'tool-test',
    status: '',
    owner: '',
    title: '',
    datacenter: 'ai-ifca',
    docker_image: '',
    submit_time: '',
    main_endpoint: '',
    description: '',
};

export const mockedDeployments: Deployment[] = [
    {
        job_ID: '3639771e-35c1-11ee-867a-0242ac110002',
        status: 'running',
        owner: 'test@egi.eu',
        title: 'Test title 1',
        description: '',
        datacenter: 'ai-ifca',
        docker_image: 'deephdc/ai4os-dev-env:latest',
        docker_command: 'deep-start --vscode',
        submit_time: '2023-08-08 07:57:26',
        resources: {
            cpu_MHz: 0,
            cpu_num: 4,
            gpu_num: 0,
            memory_MB: 8000,
            disk_MB: 10000,
        },
        endpoints: {
            api: 'http://deepaas-3639771e-35c1-11ee-867a-0242ac110002.deployments.cloud.ai4eosc.eu',
            monitor:
                'http://monitor-3639771e-35c1-11ee-867a-0242ac110002.deployments.cloud.ai4eosc.eu',
            ide: 'http://ide-3639771e-35c1-11ee-867a-0242ac110002.deployments.cloud.ai4eosc.eu',
        },
        main_endpoint:
            'http://ide-3639771e-35c1-11ee-867a-0242ac110002.deployments.cloud.ai4eosc.eu',
        alloc_ID: '6fa09b97-ca96-d406-d60f-86dea35d4be5',
    },
    {
        job_ID: '26d3fb98-32b8-11ee-a694-0242ac110003',
        status: 'running',
        owner: 'test@egi.eu',
        title: 'Test tittle 2',
        description: '',
        datacenter: 'ai-ifca',
        docker_image: 'deephdc/ai4os-dev-env:latest',
        docker_command: 'deep-start --jupyter',
        submit_time: '2023-08-04 18:48:28',
        resources: {
            cpu_MHz: 0,
            cpu_num: 4,
            gpu_num: 0,
            memory_MB: 8000,
            disk_MB: 10000,
        },
        endpoints: {
            api: 'http://deepaas-26d3fb98-32b8-11ee-a694-0242ac110003.deployments.cloud.ai4eosc.eu',
            monitor:
                'http://monitor-26d3fb98-32b8-11ee-a694-0242ac110003.deployments.cloud.ai4eosc.eu',
            ide: 'http://ide-26d3fb98-32b8-11ee-a694-0242ac110003.deployments.cloud.ai4eosc.eu',
        },
        main_endpoint:
            'http://ide-26d3fb98-32b8-11ee-a694-0242ac110003.deployments.cloud.ai4eosc.eu',
        alloc_ID: 'bbadee9b-fccc-60dc-0ad0-80e507707d26',
    },
];

export const mockedTools: Deployment[] = [
    {
        job_ID: '9a76ae28-465a-11ee-9920-0242ac110003',
        status: 'running',
        owner: 'b12b3258028a72e54d3f91abb1a679c64c6d5a21ac8b2def3b1e99cfb31e3877@egi.eu',
        title: 'Testing federated',
        description: '',
        datacenter: 'ai-ifca',
        docker_image: 'ai4oshub/ai4os-federated-server:latest',
        docker_command: '',
        submit_time: '2023-08-29 10:55:46',
        resources: {
            cpu_MHz: 0,
            cpu_num: 2,
            gpu_num: 0,
            memory_MB: 2000,
            disk_MB: 1000,
        },
        endpoints: {
            fedserver:
                'http://fedserver-9a76ae28-465a-11ee-9920-0242ac110003.deployments.cloud.ai4eosc.eu',
            ide: 'http://ide-9a76ae28-465a-11ee-9920-0242ac110003.deployments.cloud.ai4eosc.eu',
        },
        main_endpoint:
            'http://fedserver-9a76ae28-465a-11ee-9920-0242ac110003.deployments.cloud.ai4eosc.eu',
        alloc_ID: '5718d038-811e-eb97-acc6-da564971e053',
    },
    {
        job_ID: '4576ae28-465a-11ee-9920-0242ac110003',
        status: 'running',
        owner: 'b12b3258028a72e54d3f91abb1a679c64c6d5a21ac8b2def3b1e99cfb31e3877@egi.eu',
        title: 'Testing cvat',
        description: '',
        datacenter: 'ai-ifca',
        docker_image: 'ai4oshub/ai4os-cvat:latest',
        docker_command: '',
        submit_time: '2023-08-29 10:55:46',
        resources: {
            cpu_MHz: 0,
            cpu_num: 2,
            gpu_num: 0,
            memory_MB: 2000,
            disk_MB: 1000,
        },
        endpoints: {
            cvat: 'http://cvat-9a76ae28-465a-11ee-9920-0242ac110003.deployments.cloud.ai4eosc.eu',
            ide: 'http://ide-9a76ae28-465a-11ee-9920-0242ac110003.deployments.cloud.ai4eosc.eu',
        },
        main_endpoint:
            'http://cvat-9a76ae28-465a-11ee-9920-0242ac110003.deployments.cloud.ai4eosc.eu',
        alloc_ID: '5718d038-811e-eb97-acc6-da564971e053',
    },
];

export const mockedDeleteDeploymentResponse: StatusReturn = {
    status: 'success',
};

export const mockedDeploymentService = {
    getDeployments: jest.fn().mockReturnValue(of(mockedDeployments)),
    getDeploymentByUUID: jest.fn().mockReturnValue(of(mockedDeployments[0])),
    deleteDeploymentByUUID: jest
        .fn()
        .mockReturnValue(of(mockedDeleteDeploymentResponse)),
    getTools: jest.fn().mockReturnValue(of(mockedTools)),
    getToolByUUID: jest.fn().mockReturnValue(of(mockedTools[0])),
    deleteToolByUUID: jest
        .fn()
        .mockReturnValue(of(mockedDeleteDeploymentResponse)),
    postTrainModule: jest.fn().mockReturnValue(of({ status: 'success' })),
    trainTool: jest.fn().mockReturnValue(of({ status: 'success' })),
};
