import { of } from 'rxjs';
import { Ai4lifeModule, ModuleSummary } from '../interfaces/module.interface';

export const mockedModulesService = {
    getModulesSummary: jest.fn(() => of(mockModuleSummaryList)),
    getAi4lifeModules: jest.fn(() => of([])),
};

export const mockModuleSummaryList: ModuleSummary[] = [
    {
        id: 'birds-audio-classification',
        name: 'birds-audio-classification',
        title: 'Bird sound classifier',
        summary:
            'Classify audio files among bird species from the Xenocanto dataset.',
        libraries: ['TensorFlow', 'Keras'],
        tasks: ['Classification'],
        categories: ['AI4 pre trained', 'AI4 inference'],
        'data-type': ['Audio'],
        tags: ['deep-learning', 'audio-classification', 'beta'],
        dates: {
            updated: '2024-03-10T00:00:00Z',
            created: '2023-03-10T00:00:00Z',
        },
    },
    {
        id: 'ai4os-yolov8-torch',
        name: 'ai4os-yolov8-torch',
        title: 'YoloV8 model',
        summary: 'Object detection using YoloV8 model',
        libraries: ['PyTorch'],
        tasks: ['Computer Vision', 'Classification'],
        categories: ['AI4 pre trained', 'AI4 inference', 'AI4 trainable'],
        'data-type': ['Image', 'Video'],
        tags: [
            'deep-learning',
            'object-detection',
            'vo.imagine-ai.eu',
            'general purpose',
        ],
        dates: {
            updated: '2025-04-10T00:00:00Z',
            created: '2024-04-10T00:00:00Z',
        },
    },
];

export const mockAi4lifeModules: Ai4lifeModule[] = [
    {
        name: 'Cellpose Plant Nuclei ResNet',
        id: 'philosophical-panda',
        description:
            'An experimental Cellpose nuclear model fine-tuned on ovules 1136, 1137, 1139, 1170 and tested on ovules 1135.',
        license: 'MIT',
        doi: '10.5281/zenodo.13219987',
        created: '2024-07-31T17:21:47.038705',
        covers: ['https://test.com/philosophical-panda.png'],
        downloadCount: '324',
        tags: ['cellpose', '3d'],
    },
    {
        name: 'GelGenie-Universal-V1',
        id: 'self-disciplined-blowfish',
        description:
            'U-Net trained to segment and extract gel bands from gel electrophoresis images. This is the universal version (V1) of the model.',
        license: 'Apache-2.0',
        doi: '10.5281/zenodo.14710874',
        created: '2025-01-21T10:15:52.020217',
        covers: ['https://test.com/self-disciplined-blowfish.png'],
        downloadCount: '?',
        tags: ['Pytorch', 'DeepImageJ'],
    },
];

export const mockedModuleService = {
    createDeploymentGradio: jest.fn().mockReturnValue(of()),
    getDeploymentGradio: jest.fn().mockReturnValue(of()),
};
