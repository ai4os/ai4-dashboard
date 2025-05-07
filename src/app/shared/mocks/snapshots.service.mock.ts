import { of } from 'rxjs';
import { Snapshot } from '../interfaces/deployment.interface';
import { mockedDeleteDeploymentResponse } from './deployments.service.mock';

export const mockedSnapshots: Snapshot[] = [
    {
        snapshot_ID: '1234',
        title: 'SnapshotTest',
        status: 'complete',
        submit_time: '2024-11-12 09:30:40',
        docker_image:
            'registry.services.ai4os.eu/user-snapshots/b965ce0bceb90d42b69d0767e2148c297e5f4a5d9db315432747e84a4ccebf0b_at_egi.eu',
        size: 2064652547,
        nomad_ID: '',
    },
    {
        snapshot_ID: 'snapshot-test2',
        title: '',
        description: '',
        status: '',
        submit_time: '',
        docker_image: '',
        size: 2064652547,
        nomad_ID: '',
    },
];

export const mockedSnapshotCreateResponse = {
    status: 'success',
    snapshot_ID: 'snapshot1234',
};

export const mockedSnapshotDeleteResponse = { status: 'success' };

export const mockedSnapshotService = {
    getSnapshots: jest.fn().mockReturnValue(of(mockedSnapshots)),
    deleteSnapshotByUUID: jest
        .fn()
        .mockReturnValue(of(mockedDeleteDeploymentResponse)),
};
