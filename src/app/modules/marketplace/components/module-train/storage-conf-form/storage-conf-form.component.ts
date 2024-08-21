import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormGroupDirective,
    Validators,
} from '@angular/forms';
import {
    ModuleStorageConfiguration,
    confObject,
    confObjectStringBoolean,
} from '@app/shared/interfaces/module.interface';
import { ZenodoSimpleDataset } from '@app/shared/interfaces/dataset.interface';
import { ProfileService } from '@app/modules/profile/services/profile.service';
import { StorageCredential } from '@app/shared/interfaces/profile.interface';

const mockedConfObject: confObject = {
    name: '',
    value: '',
    description: '',
};
const mockedConfObjectStringBoolean: confObjectStringBoolean = {
    name: '',
    value: { stringValue: '', booleanValue: false },
    description: '',
};

@Component({
    selector: 'app-storage-conf-form',
    templateUrl: './storage-conf-form.component.html',
    styleUrls: ['./storage-conf-form.component.scss'],
})
export class StorageConfFormComponent implements OnInit {
    constructor(
        private profileService: ProfileService,
        private ctrlContainer: FormGroupDirective,
        private fb: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    parentForm!: FormGroup;

    storageConfFormGroup = this.fb.group({
        storageServiceDatasetSelect: new FormControl({
            value: '',
            disabled: true,
        }),
        rcloneConfInput: [''],
        storageUrlInput: [''],
        rcloneVendorSelect: [''],
        rcloneUserInput: [''],
        rclonePasswordInput: [''],
        zenodoCommunitySelect: new FormControl({ value: '', disabled: true }),
        zenodoDatasetSelect: new FormControl({ value: '', disabled: true }),
        zenodoVersionSelect: new FormControl({ value: '', disabled: true }),
        doiInput: [''],
        datasetsList: [[{ doi: '', force_pull: false }]],
    });

    protected _defaultFormValues: ModuleStorageConfiguration = {
        rclone_conf: mockedConfObject,
        rclone_url: mockedConfObject,
        rclone_vendor: mockedConfObject,
        rclone_user: mockedConfObject,
        rclone_password: mockedConfObject,
        datasets: mockedConfObjectStringBoolean,
    };

    @Input() set showHelp(showHelp: boolean) {
        this._showHelp = showHelp;
    }

    @Input() set defaultFormValues(
        defaultFormValues: ModuleStorageConfiguration
    ) {
        if (defaultFormValues) {
            this._defaultFormValues = defaultFormValues;
            this.storageConfFormGroup
                .get('rcloneConfInput')
                ?.setValue(defaultFormValues.rclone_conf.value as string);

            this.storageConfFormGroup
                .get('storageUrlInput')

                ?.setValue(defaultFormValues.rclone_url.value as string);
            this.storageConfFormGroup
                .get('rcloneUserInput')
                ?.setValue(defaultFormValues.rclone_user.value as string);

            this.storageConfFormGroup
                .get('rcloneVendorSelect')
                ?.setValue(defaultFormValues.rclone_vendor.value as string);
            defaultFormValues.rclone_vendor.options?.forEach(
                (option: string) => {
                    this.rcloneVendorOptions.push({
                        value: option,
                        viewValue: option,
                    });
                }
            );
            this.storageConfFormGroup.get('datasetsList')?.setValue([]);
        }
    }

    protected _showHelp = false;
    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;

    hidePassword = true;
    protected credentialsLoading = true;

    rcloneVendorOptions: { value: string; viewValue: string }[] = [];
    protected storageServiceOptions: { value: string; viewValue: string }[] =
        [];
    datasets: { doi: string; force_pull: boolean }[] = [];
    credentials: StorageCredential[] = [];

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl(
            'storageConfForm',
            this.storageConfFormGroup
        );
        this.getLinkedStorageServices();
    }

    addDataset(dataset: ZenodoSimpleDataset): void {
        const rcloneUser = this.storageConfFormGroup.get('rcloneUserInput');
        const rclonePassword = this.storageConfFormGroup.get(
            'rclonePasswordInput'
        );
        rcloneUser?.markAllAsTouched();
        rclonePassword?.markAllAsTouched();
        rcloneUser?.setValidators([Validators.required]);
        rclonePassword?.setValidators([Validators.required]);
        rcloneUser?.updateValueAndValidity();
        rclonePassword?.updateValueAndValidity();

        this.datasets.push({ doi: String(dataset.doi), force_pull: false });
        this.storageConfFormGroup.get('datasetsList')?.setValue(this.datasets);
    }

    deleteDataset(dataset: ZenodoSimpleDataset): void {
        this.datasets = this.datasets.filter((d) => d.doi !== dataset.doi);
        this.storageConfFormGroup.get('datasetsList')?.setValue(this.datasets);

        if (this.datasets.length == 0) {
            const rcloneUser = this.storageConfFormGroup.get('rcloneUserInput');
            const rclonePassword = this.storageConfFormGroup.get(
                'rclonePasswordInput'
            );
            rcloneUser?.setValidators(null);
            rclonePassword?.setValidators(null);
            rcloneUser?.updateValueAndValidity();
            rclonePassword?.updateValueAndValidity();
        }
    }

    updateDataset(dataset: ZenodoSimpleDataset): void {
        const d = this.datasets.find((d) => d.doi === dataset.doi);
        if (d) {
            d.force_pull = dataset.force_pull;
        }
    }

    getLinkedStorageServices() {
        this.profileService
            .getExistingCredentials()
            .subscribe((credentials) => {
                this.credentials = Object.values(credentials);
                if (this.credentials.length > 0) {
                    this.credentials.forEach(
                        (credential: StorageCredential) => {
                            this.storageServiceOptions.push({
                                value: credential.server,
                                viewValue: credential.server.replace(
                                    'https://',
                                    ''
                                ),
                            });
                        }
                    );
                    this.storageConfFormGroup
                        .get('storageServiceDatasetSelect')
                        ?.setValue(this.storageServiceOptions[0].value);
                    this.storageConfFormGroup
                        .get('storageServiceDatasetSelect')
                        ?.enable();
                    this.credentialsLoading = false;
                    this.updateStorageConfiguration();
                }
            });
    }

    updateStorageConfiguration() {
        const storageServiceUrl = this.storageConfFormGroup.get(
            'storageServiceDatasetSelect'
        )?.value;
        const storageServiceCredentials = this.credentials.find(
            (c) => c.server === storageServiceUrl
        );
        if (storageServiceCredentials) {
            this.storageConfFormGroup
                .get('rcloneUserInput')
                ?.setValue(storageServiceCredentials.loginName);
            this.storageConfFormGroup
                .get('rclonePasswordInput')
                ?.setValue(storageServiceCredentials.appPassword);
            this.storageConfFormGroup
                .get('storageUrlInput')
                ?.setValue(
                    storageServiceCredentials.server + '/remote.php/webdav/'
                );
            this.storageConfFormGroup
                .get('rcloneVendorSelect')
                ?.setValue(storageServiceCredentials.vendor);
        }
    }
}
