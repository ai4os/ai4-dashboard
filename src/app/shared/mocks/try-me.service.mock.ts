import { of } from 'rxjs';
import { GradioDeployment } from '../interfaces/module.interface';

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
