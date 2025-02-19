import {
    Ai4eoscModule,
    ModuleSummary,
} from '@app/shared/interfaces/module.interface';

export const module: Ai4eoscModule = {
    categories: ['Machine Learning', 'Federated Learning'],
    'data-type': ['Model', 'Dataset'],
    dates: {
        created: '2024-07-24',
        updated: '2024-09-20',
    },
    doi: '10.1000/xyz124',
    libraries: ['TensorFlow', 'PyTorch'],
    summary: 'A federated learning server for AI4OS projects.',
    tags: ['federated-learning', 'open-source', 'AI'],
    tasks: ['Classification', 'Clustering'],
    title: 'sTest',
    description: '',
    links: {
        source_code: '',
    },
    id: 'ai4-test',
    license: 'MIT',
};

export const modulesSummaryList: Array<ModuleSummary> = [
    {
        title: 'Test',
        summary: '',
        categories: ['development'],
        tags: ['test'],
        name: 'ai4-test',
        libraries: [],
        tasks: [],
        id: 'ai4-test',
    },
    {
        title: 'Test2',
        summary: '',
        categories: [],
        tags: ['test'],
        name: 'ai4-test',
        libraries: [],
        tasks: [],
        id: 'ai4-test',
    },
];
