import { ModuleStorageConfiguration } from '@app/shared/interfaces/module.interface';

export const storageDefaultFormValues: ModuleStorageConfiguration = {
    rclone_conf: {
        name: 'RCLONE configuration',
        value: '/srv/.rclone/rclone.conf',
        description: 'rclone.conf location',
    },
    rclone_url: {
        name: 'Storage URL',
        value: '',
        description:
            'Remote storage link to be accessed via rclone (webdav). For example, in Nextcloud `https://share.cloud.ai4eosc.eu/remote.php/dav/files/<USER-ID>`',
    },
    rclone_vendor: {
        name: 'RCLONE vendor',
        value: 'nextcloud',
        options: ['nextcloud'],
        description: 'RCLONE vendor (webdav)',
    },
    rclone_user: {
        name: 'RCLONE user',
        value: '',
        description: 'rclone user to access a webdav remote storage',
    },
    rclone_password: {
        name: 'RCLONE user password',
        value: '',
        description: '',
    },
    datasets: {
        name: 'Info of the datasets you want to download',
        value: { stringValue: '', booleanValue: false },
        description:
            'Each element in the list should be a dict containing doi and force_pull keys. It requires the definition of all RCLONE variables.',
    },
};
