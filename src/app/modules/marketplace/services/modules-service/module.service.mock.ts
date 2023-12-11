import { Module, ModuleSummary } from '@app/shared/interfaces/module.interface';

export const module: Module = {
    title: 'Test',
    summary: '',
    description: '',
    keywords: [''],
    license: '',
    date_creation: '2023-08-08 07:57:26',
    dataset_url: '',
    sources: {
        dockerfile_repo: '',
        docker_registry_repo: '',
        code: '',
    },
    continuous_integration: {
        build_status_badge: '',
        build_status_url: '',
    },
    tosca: [],
};

export const modulesSummaryList: Array<ModuleSummary> = [
    {
        name: 'Test',
        title: 'Test',
        summary: '',
        keywords: [],
    },
];
