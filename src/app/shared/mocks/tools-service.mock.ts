import { of, throwError } from 'rxjs';
import { ModuleSummary, VllmModelConfig } from '../interfaces/module.interface';

export const mockVllms: VllmModelConfig[] = [
    {
        name: 'Test LLM 1',
        description: 'A mock LLM model',
        family: '',
        license: '',
        context: '',
        needs_HF_token: false,
        args: [],
    },
    {
        name: 'Test LLM 2',
        description: 'Another mock LLM model',
        family: '',
        license: '',
        context: '',
        needs_HF_token: false,
        args: [],
    },
];

export const mockTools: ModuleSummary[] = [
    {
        id: 'ai4os-federated-server',
        name: 'ai4os-federated-server',
        title: 'Federated learning with Flower',
        summary: 'Run federated learning trainings using the Flower framework.',
        libraries: ['Other'],
        tasks: ['Other'],
        categories: ['AI4 tools'],
        'data-type': ['Other'],
        tags: ['federated-learning'],
        dates: {
            updated: '2024-03-10T00:00:00Z',
            created: '2023-03-10T00:00:00Z',
        },
    },
    {
        id: 'ai4os-cvat',
        name: 'ai4os-cvat',
        title: 'CVAT Image Annotation',
        summary:
            'Image annotation tool that uses the Computer Vision Annotation Tool (CVAT)',
        libraries: ['Other'],
        tasks: ['Computer Vision'],
        categories: ['AI4 tools'],
        'data-type': ['Image', 'Video'],
        tags: ['annotation', 'data-preparation'],
        dates: {
            updated: '2025-04-10T00:00:00Z',
            created: '2024-04-10T00:00:00Z',
        },
    },
];

export const mockedToolsService = {
    getVllmModelConfiguration: jest.fn().mockReturnValue(of(mockVllms)),
    getToolsSummary: jest.fn().mockReturnValue(of(mockTools)),
};

export const mockedToolsServiceWithError = {
    getVllmModelConfiguration: jest.fn(() =>
        throwError(() => new Error('Failed to fetch LLMs'))
    ),
};
