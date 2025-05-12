import { ModuleGeneralConfiguration } from '@app/shared/interfaces/module.interface';

export const generalDefaultFormValues: ModuleGeneralConfiguration = {
    title: {
        name: 'Deployment title',
        value: '',
        description:
            'Provide short title for this deployment (less than 45 characters). Useful when you have lots of different active deployments. ',
    },
    desc: {
        name: 'Deployment description',
        value: '',
        description:
            'Provide some additional extended information about this deployment.',
    },
    docker_image: {
        name: 'Docker image ',
        value: 'ai4oshub/fast-neural-transfer',
        description: 'Docker image of your AI module.',
    },
    docker_tag: {
        name: 'Docker tag',
        value: 'latest',
        description:
            'Docker tag to use. Tags are module dependent. You should choose the appropriate tag for your selected hardware (eg. use a `gpu`-like tag if you plan to run on GPUs).',
        options: ['latest'],
    },
    service: {
        name: 'Service to run',
        value: 'deepaas',
        description:
            "When selecting DEEPaaS you won't be able to use JupyterLab, and vice versa. If you want to have access to both services at the same time your best option is to deploy with JupyterLab, then open a terminal window and run DEEPaaS yourself typing `deep-start --deepaas`. In some container, you will also be able to deploy VS Code.",
        options: ['deepaas', 'jupyter'],
    },
    jupyter_password: {
        name: 'IDE password',
        value: '',
        description:
            'Select a password for your IDE (JupyterLab or VS Code). It should have at least 9 characters. ',
    },
};
