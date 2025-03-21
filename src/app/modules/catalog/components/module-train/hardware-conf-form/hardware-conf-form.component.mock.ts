import { ModuleHardwareConfiguration } from '@app/shared/interfaces/module.interface';

export const defaultFormValues: ModuleHardwareConfiguration = {
    cpu_num: {
        range: [1, 2],
        name: '',
        value: '',
        description: '',
    },
    ram: {
        range: [1, 2],
        name: '',
        value: '',
        description: '',
    },
    disk: {
        range: [1, 2],
        name: '',
        value: '',
        description: '',
    },
    gpu_num: {
        range: [1, 2],
        name: '',
        value: '',
        description: '',
    },
    gpu_type: {
        name: '',
        value: '',
        description: '',
    },
};
