import { of, throwError } from 'rxjs';
import {
    Ai4LifeLoaderToolConfiguration,
    ModuleSummary,
    VllmModelConfig,
} from '../interfaces/module.interface';
import { mockAi4eoscModules } from './modules-service.mock';
import { generalDefaultFormValues } from '@app/modules/catalog/components/train/general-conf-form/general-conf-form.component.mock';
import { hardwareDefaultFormValues } from '@app/modules/catalog/components/train/hardware-conf-form/hardware-conf-form.component.mock';

export const mockedVllmsConfig: VllmModelConfig[] = [
    {
        name: 'Llama-3.2-3B-Instruct',
        description: 'A mock LLM model',
        family: 'meta-llama',
        needs_HF_token: true,
        license: '',
        context: '',
        args: [],
    },
    {
        name: 'Qwen2.5-7B-Instruct-AWQ',
        description: 'Another mock LLM model',
        family: 'Qwen',
        needs_HF_token: false,
        license: '',
        context: '',
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

export const mockAi4lifeTool: ModuleSummary = {
    id: 'ai4os-ai4life-loader',
    name: 'ai4os-ai4life-loader',
    title: 'AI4life model loader',
    summary: 'Support for inference of the AI4LIFE model on the marketplace.',
    libraries: ['PyTorch', 'Scikit-learn'],
    tasks: ['Computer Vision'],
    categories: ['AI4 tools'],
    'data-type': ['Image'],
    tags: ['deep learning'],
    dates: {
        updated: '2024-03-10T00:00:00Z',
        created: '2023-03-10T00:00:00Z',
    },
};

const mockAi4LifeLoaderToolConfiguration: Ai4LifeLoaderToolConfiguration = {
    general: generalDefaultFormValues,
    hardware: hardwareDefaultFormValues,
};

export const mockedToolsService = {
    getTool: jest.fn().mockReturnValue(of(mockAi4eoscModules[0])),
    getVllmModelConfiguration: jest.fn().mockReturnValue(of(mockedVllmsConfig)),
    getToolsSummary: jest.fn().mockReturnValue(of(mockTools)),
    getAi4LifeConfiguration: jest
        .fn()
        .mockReturnValue(of(mockAi4LifeLoaderToolConfiguration)),
};

export const mockedToolsServiceWithError = {
    getVllmModelConfiguration: jest.fn(() =>
        throwError(() => new Error('Failed to fetch LLMs'))
    ),
};
