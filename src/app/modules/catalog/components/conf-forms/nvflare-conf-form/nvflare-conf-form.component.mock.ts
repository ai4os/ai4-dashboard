import { NvflareConfiguration } from '@app/shared/interfaces/module.interface';

export const nvflareDefaultFormValues: NvflareConfiguration = {
    username: {
        name: 'NVFlare Dashboard username',
        value: '',
        description:
            'Select a username / email for admin in your NVFlare Dashboard instance.',
    },
    password: {
        name: 'NVFlare password',
        value: '',
        description:
            'Admin password for both the Dashboard and the Jupyter server instance.',
    },
    app_location: {
        name: 'NVFlare project docker image download link',
        value: 'registry.services.ai4os.eu/ai4os/ai4os-nvflare-client:2.5-Stifo',
        description: 'NVFlare project docker image download link',
    },
    public_project: {
        name: 'Make NVFlare project public',
        value: 'False',
        options: ['False', 'True'],
        description:
            'If the project is public, user sign-up is enabled. Otherwise the admin enables the users.',
        range: [],
    },
    starting_date: {
        name: 'NVFlare project start date',
        value: '',
        description: 'NVFlare project start date (DD/MM/YY)',
    },
    end_date: {
        name: 'NVFlare project end date',
        value: '',
        description: 'NVFlare project end date (DD/MM/YY)',
    },
};
