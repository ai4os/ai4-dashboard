import {
    Deployment,
    DeploymentTableRow,
    StatusReturn,
} from '@app/shared/interfaces/deployment.interface';
import { of } from 'rxjs';

export const mockedBatchDeployments: Deployment[] = [
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

export const mockedDeleteDeploymentResponse: StatusReturn = {
    status: 'success',
};

export const expectedModulesDataset: DeploymentTableRow[] = [
    {
        uuid: '3639771e-35c1-11ee-867a-0242ac110002',
        name: 'Test title 1',
        status: 'running',
        containerName: 'deephdc/ai4os-dev-env:latest',
        gpus: 0,
        creationTime: '2023-08-08 07:57:26',
        endpoints: {
            api: 'http://deepaas-3639771e-35c1-11ee-867a-0242ac110002.deployments.cloud.ai4eosc.eu',
            monitor:
                'http://monitor-3639771e-35c1-11ee-867a-0242ac110002.deployments.cloud.ai4eosc.eu',
            ide: 'http://ide-3639771e-35c1-11ee-867a-0242ac110002.deployments.cloud.ai4eosc.eu',
        },
        mainEndpoint:
            'http://ide-3639771e-35c1-11ee-867a-0242ac110002.deployments.cloud.ai4eosc.eu',
        datacenter: 'ai-ifca',
    },
    {
        uuid: '26d3fb98-32b8-11ee-a694-0242ac110003',
        name: 'Test tittle 2',
        status: 'running',
        containerName: 'deephdc/ai4os-dev-env:latest',
        gpus: 0,
        creationTime: '2023-08-04 18:48:28',
        endpoints: {
            api: 'http://deepaas-26d3fb98-32b8-11ee-a694-0242ac110003.deployments.cloud.ai4eosc.eu',
            monitor:
                'http://monitor-26d3fb98-32b8-11ee-a694-0242ac110003.deployments.cloud.ai4eosc.eu',
            ide: 'http://ide-26d3fb98-32b8-11ee-a694-0242ac110003.deployments.cloud.ai4eosc.eu',
        },
        mainEndpoint:
            'http://ide-26d3fb98-32b8-11ee-a694-0242ac110003.deployments.cloud.ai4eosc.eu',
        datacenter: 'ai-ifca',
    },
];

export const mockedBatchService = {
    getBatchDeployments: jest.fn().mockReturnValue(of(mockedBatchDeployments)),
    getBatchDeploymentByUUID: jest
        .fn()
        .mockReturnValue(of(mockedBatchDeployments[0])),
    deleteBatchDeploymentByUUID: jest
        .fn()
        .mockReturnValue(of(mockedDeleteDeploymentResponse)),
};
