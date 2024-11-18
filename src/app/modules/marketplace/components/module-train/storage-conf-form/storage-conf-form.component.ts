import { MediaMatcher } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormGroupDirective,
    Validators,
} from '@angular/forms';
import {
    ModuleStorageConfiguration,
    Snapshot,
    confObject,
    confObjectStringBoolean,
} from '@app/shared/interfaces/module.interface';
import { ZenodoSimpleDataset } from '@app/shared/interfaces/dataset.interface';
import { ProfileService } from '@app/modules/profile/services/profile.service';
import { StorageCredential } from '@app/shared/interfaces/profile.interface';
import { StorageService } from '@app/modules/marketplace/services/storage-service/storage.service';
import { timeout, catchError, throwError } from 'rxjs';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModulesService } from '@app/modules/marketplace/services/modules-service/modules.service';
import { DatasetsListComponent } from '../datasets/datasets-list/datasets-list.component';

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
        private storageService: StorageService,
        private snackbarService: SnackbarService,
        private modulesService: ModulesService,
        private ctrlContainer: FormGroupDirective,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }
    @ViewChild(DatasetsListComponent)
    datasetsListComponent!: DatasetsListComponent;

    @Input() isCvatTool = false;
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

    parentForm!: FormGroup;

    storageConfFormGroup = this.fb.group({
        storageServiceDatasetSelect: new FormControl({
            value: '',
            disabled: true,
        }),
        snapshotDatasetSelect: new FormControl({
            value: '',
            disabled: true,
        }),
        rcloneConfInput: [''],
        storageUrlInput: [''],
        rcloneVendorSelect: [''],
        rcloneUserInput: ['', [Validators.required]],
        rclonePasswordInput: ['', [Validators.required]],
        zenodoCommunitySelect: new FormControl({ value: '', disabled: true }),
        zenodoDatasetSelect: new FormControl({ value: '', disabled: true }),
        zenodoVersionSelect: new FormControl({ value: '', disabled: true }),
        doiUrlInput: [''],
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

    protected _showHelp = false;
    hidePassword = true;
    protected credentialsLoading = true;
    protected snapshotsLoading = false;

    rcloneVendorOptions: { value: string; viewValue: string }[] = [];
    protected storageServiceOptions: { value: string; viewValue: string }[] =
        [];
    protected snapshotOptions: { value: string; viewValue: string }[] = [];
    datasets: { doi: string; force_pull: boolean }[] = [];
    suggestedDataset: ZenodoSimpleDataset = {
        doiOrUrl: '',
        title: '',
        source: '',
        force_pull: false,
    };
    credentials: StorageCredential[] = [];
    snapshots: Snapshot[] = [];

    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl(
            'storageConfForm',
            this.storageConfFormGroup
        );

        this.getSuggestedDatasets();
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

        this.datasets.push({
            doi: String(dataset.doiOrUrl),
            force_pull: false,
        });
        this.storageConfFormGroup.get('datasetsList')?.setValue(this.datasets);
    }

    deleteDataset(dataset: ZenodoSimpleDataset): void {
        this.datasets = this.datasets.filter((d) => d.doi !== dataset.doiOrUrl);
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
        const d = this.datasets.find((d) => d.doi === dataset.doiOrUrl);
        if (d) {
            d.force_pull = dataset.force_pull;
        }
    }

    getSuggestedDatasets() {
        this.route.parent?.params.subscribe((params) => {
            this.modulesService.getModule(params['id']).subscribe((module) => {
                if (module.links.dataset) {
                    this.suggestedDataset = {
                        doiOrUrl: module.links.dataset,
                        title: module.links.dataset,
                        source: 'http',
                        force_pull: false,
                    };
                }
            });
        });
    }

    getLinkedStorageServices() {
        this.profileService
            .getExistingCredentials()
            .pipe(
                timeout(20000),
                catchError(() => {
                    this.credentialsLoading = false;
                    return throwError(() =>
                        this.snackbarService.openError(
                            'No storage providers available. Please try again later.'
                        )
                    );
                })
            )
            .subscribe({
                next: (credentials) => {
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
                    } else {
                        this.credentialsLoading = false;
                    }
                },
                error: () => {
                    this.credentialsLoading = false;
                },
            });
    }

    updateStorageConfiguration() {
        const storageServiceUrl = this.storageConfFormGroup.get(
            'storageServiceDatasetSelect'
        )?.value;
        const storageServiceName = storageServiceUrl?.replace('https://', '');
        const storageServiceCredentials = this.credentials.find(
            (c) => c.server === storageServiceUrl
        );
        if (storageServiceName && storageServiceCredentials) {
            this.storageConfFormGroup
                .get('rcloneUserInput')
                ?.setValue(storageServiceCredentials.loginName);
            this.storageConfFormGroup
                .get('rclonePasswordInput')
                ?.setValue(storageServiceCredentials.appPassword);
            this.storageConfFormGroup
                .get('storageUrlInput')
                ?.setValue(
                    storageServiceCredentials.server +
                        '/remote.php/dav/files/' +
                        storageServiceCredentials.loginName
                );
            this.storageConfFormGroup
                .get('rcloneVendorSelect')
                ?.setValue(storageServiceCredentials.vendor);
            if (this.isCvatTool) {
                this.updateSnapshots(storageServiceName);
            }
        } else {
            this.storageConfFormGroup.get('rcloneUserInput')?.setValue('');
            this.storageConfFormGroup.get('rclonePasswordInput')?.setValue('');
            this.storageConfFormGroup.get('storageUrlInput')?.setValue('');
            this.storageConfFormGroup.get('rcloneVendorSelect')?.setValue('');
            this.snapshotOptions = [];
            this.snapshots = [];
            this.storageConfFormGroup.get('snapshotDatasetSelect')?.disable();
        }
    }

    updateSnapshots(storageName: string) {
        this.snapshotsLoading = true;
        this.storageConfFormGroup.get('snapshotDatasetSelect')?.disable();
        this.storageService.getSnapshots(storageName).subscribe({
            next: (snapshots: Snapshot[]) => {
                this.snapshots = Object.values(snapshots);
                this.snapshots = this.snapshots.filter((s) => s.IsDir);
                if (this.snapshots.length > 0) {
                    this.snapshots.forEach((snapshot: Snapshot) => {
                        this.snapshotOptions.push({
                            value: snapshot.Name,
                            viewValue: snapshot.Name,
                        });
                    });
                    this.storageConfFormGroup
                        .get('snapshotDatasetSelect')
                        ?.setValue(this.snapshotOptions[0].value);
                    this.storageConfFormGroup
                        .get('snapshotDatasetSelect')
                        ?.enable();
                }
                this.snapshotsLoading = false;
            },
            error: () => {
                this.snapshots = [];
                this.snapshotOptions = [];
                this.snapshotsLoading = false;
            },
        });
    }
}
