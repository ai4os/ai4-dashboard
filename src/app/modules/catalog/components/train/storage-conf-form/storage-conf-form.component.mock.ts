import { ModuleStorageConfiguration } from '@app/shared/interfaces/module.interface';

export const storageDefaultFormValues: ModuleStorageConfiguration = {
    datasets: {
        name: 'Info of the datasets you want to download',
        value: { stringValue: '', booleanValue: false },
        description:
            'Each element in the list should be a dict containing doi and force_pull keys. It requires the definition of all RCLONE variables.',
    },
};
