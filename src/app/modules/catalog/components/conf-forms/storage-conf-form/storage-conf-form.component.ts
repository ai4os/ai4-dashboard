import { MediaMatcher } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewChild,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormGroupDirective,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import {
    ModuleStorageConfiguration,
    File,
    confObject,
    confObjectStringBoolean,
} from '@app/shared/interfaces/module.interface';
import { ZenodoSimpleDataset } from '@app/shared/interfaces/dataset.interface';
import { ProfileService } from '@app/modules/profile/services/profile-service/profile.service';
import { StorageCredential } from '@app/shared/interfaces/profile.interface';
import { StorageService } from '@app/modules/catalog/services/storage-service/storage.service';
import { timeout, catchError, throwError } from 'rxjs';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import {
    ConfirmationDialogComponent,
    ConfirmationDialogData,
} from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import {
    MatChipSelectionChange,
    MatChipListbox,
    MatChipOption,
} from '@angular/material/chips';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ModulesService } from '@app/modules/catalog/services/modules-service/modules.service';
import { DatasetsListComponent } from '../../train/datasets/datasets-list/datasets-list.component';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import {
    MatFormField,
    MatLabel,
    MatSuffix,
    MatHint,
} from '@angular/material/input';
import {
    MatSelect,
    MatOption,
    MatSelectTrigger,
} from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIconButton, MatButton } from '@angular/material/button';
import { UiSelectComponent } from '@app/shared/components/ui/ui-select/ui-select.component';
import { UiLoaderComponent } from '@app/shared/components/ui/ui-loader/ui-loader.component';
import { UiChipComponent } from '@app/shared/components/ui/ui-chip/ui-chip.component';

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
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatIcon,
        NgClass,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
        MatProgressSpinner,
        MatSuffix,
        MatHint,
        RouterLink,
        MatChipListbox,
        MatChipOption,
        MatSelectTrigger,
        MatIconButton,
        MatButton,
        DatasetsListComponent,
        TranslatePipe,
        UiSelectComponent,
        UiLoaderComponent,
        UiChipComponent,
    ],
})
export class StorageConfFormComponent implements OnInit {
    profileService = inject(ProfileService);
    storageService = inject(StorageService);
    translateService = inject(TranslateService);
    snackbarService = inject(SnackbarService);
    modulesService = inject(ModulesService);
    ctrlContainer = inject(FormGroupDirective);
    confirmationDialog = inject(MatDialog);
    fb = inject(FormBuilder);
    route = inject(ActivatedRoute);
    media = inject(MediaMatcher);
    changeDetectorRef = inject(ChangeDetectorRef);

    constructor() {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () =>
            this.changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }
    @ViewChild(DatasetsListComponent)
    datasetsListComponent!: DatasetsListComponent;

    @Input() isCvatTool = false;
    @Input() rcloneIsRequired = false;
    @Input() set showHelp(showHelp: boolean) {
        this._showHelp = showHelp;
    }
    @Input() set defaultFormValues(
        defaultFormValues: ModuleStorageConfiguration
    ) {
        if (defaultFormValues) {
            this._defaultFormValues = defaultFormValues;
            this.storageConfFormGroup.get('datasetsList')?.setValue([]);
        }
    }

    parentForm!: FormGroup;

    storageConfFormGroup = this.fb.group({
        storageServiceDatasetSelect: ['', [Validators.required]],
        snapshotDatasetSelect: new FormControl({
            value: '',
            disabled: true,
        }),
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
    sortBy = 'recent';
    snapshots: File[] = [];

    private readonly _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl(
            'storageConfForm',
            this.storageConfFormGroup
        );

        setTimeout(() => {
            this.parentForm.updateValueAndValidity();
        });

        this.getSuggestedDatasets();
        this.getLinkedStorageServices();
    }

    addDataset(dataset: ZenodoSimpleDataset): void {
        const storageServiceDataset = this.storageConfFormGroup.get(
            'storageServiceDatasetSelect'
        );
        storageServiceDataset?.markAllAsTouched();
        storageServiceDataset?.setValidators([Validators.required]);
        storageServiceDataset?.updateValueAndValidity();

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
            const storageServiceDataset = this.storageConfFormGroup.get(
                'storageServiceDatasetSelect'
            );
            storageServiceDataset?.setValidators(null);
            storageServiceDataset?.updateValueAndValidity();
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
            if (params['id'] !== 'snapshots') {
                this.modulesService
                    .getModule(params['id'])
                    .subscribe((module) => {
                        if (module.links.dataset) {
                            this.suggestedDataset = {
                                doiOrUrl: module.links.dataset,
                                title: module.links.dataset,
                                source: 'http',
                                force_pull: false,
                            };
                        }
                    });
            }
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
                    this.storageServiceOptions = [
                        { value: '', viewValue: '-' },
                    ];

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
                complete: () => {
                    const storageServiceDatasetSelect =
                        this.storageConfFormGroup.get(
                            'storageServiceDatasetSelect'
                        );
                    storageServiceDatasetSelect?.clearValidators();
                    storageServiceDatasetSelect?.updateValueAndValidity();
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
            if (this.isCvatTool) {
                this.updateSnapshots(storageServiceName);
            }
        } else {
            this.snapshotOptions = [];
            this.snapshots = [];
            this.storageConfFormGroup.get('snapshotDatasetSelect')?.disable();
        }
    }

    updateSnapshots(storageName: string) {
        this.snapshotsLoading = true;
        this.storageConfFormGroup.get('snapshotDatasetSelect')?.disable();
        this.storageService.getSnapshots(storageName).subscribe({
            next: (snapshots: File[]) => {
                this.snapshots = Object.values(snapshots);
                this.snapshotOptions = [{ value: '', viewValue: '-' }];

                // filter directories
                this.snapshots = this.snapshots.filter((s) => s.IsDir);
                // sort by date (newest first)
                this.snapshots.sort((a, b) => {
                    return (
                        new Date(b.ModTime).getTime() -
                        new Date(a.ModTime).getTime()
                    );
                });
                if (this.snapshots.length > 0) {
                    this.snapshots.forEach((snapshot: File) => {
                        this.snapshotOptions.push({
                            value: snapshot.Name,
                            viewValue: snapshot.Name,
                        });
                    });
                    this.storageConfFormGroup
                        .get('snapshotDatasetSelect')
                        ?.setValue('-');
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

    deleteSnapshot(ev: Event, option: string) {
        ev.stopPropagation();
        ev.preventDefault();
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: {
                    title: 'CATALOG.MODULE-TRAIN.DATA-CONF-FORM.SNAPSHOT-DELETE',
                } as ConfirmationDialogData,
                panelClass: 'ui-dialog-panel',
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.snapshotsLoading = true;
                    const storageServiceUrl = this.storageConfFormGroup.get(
                        'storageServiceDatasetSelect'
                    )?.value;
                    const storageServiceName = storageServiceUrl?.replace(
                        'https://',
                        ''
                    );
                    this.storageService
                        .deleteSnapshot(storageServiceName!, option)
                        .subscribe({
                            next: () => {
                                this.snapshots = this.snapshots.filter(
                                    (o) => o.Name !== option
                                );
                                this.snapshotOptions =
                                    this.snapshotOptions.filter(
                                        (o) => o.value !== option
                                    );
                                this.snapshotsLoading = false;
                                this.snackbarService.openSuccess(
                                    'Successfully deleted snapshot with name: ' +
                                        option
                                );
                            },
                            error: () => {
                                this.snapshotsLoading = false;
                                this.snackbarService.openError(
                                    'Error deleting snapshot with name: ' +
                                        option
                                );
                            },
                            complete: () => {
                                this.snapshotsLoading = false;
                            },
                        });
                }
            });
    }

    selectedSortingChip(event: MatChipSelectionChange) {
        const selectedChipValue = event.source.value;

        if (!event.selected && selectedChipValue === this.sortBy) {
            event.source.select();
            return;
        }

        if (event.selected) {
            this.snapshotOptions = [];
            if (selectedChipValue === 'name') {
                this.sortBy = 'name';
                this.snapshots.sort((a, b) => {
                    return a.Name.localeCompare(b.Name);
                });
            } else if (selectedChipValue === 'recent') {
                this.sortBy = 'recent';
                this.snapshots.sort((a, b) => {
                    return (
                        new Date(b.ModTime).getTime() -
                        new Date(a.ModTime).getTime()
                    );
                });
            }

            this.snapshots.forEach((snapshot: File) => {
                this.snapshotOptions.push({
                    value: snapshot.Name,
                    viewValue: snapshot.Name,
                });
            });
        }
    }

    suggestedDatasetIsValid(): boolean {
        const doiPattern = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
        const urlPattern =
            /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/i;
        const validDOI = doiPattern.test(this.suggestedDataset.title);
        const validURL = urlPattern.test(this.suggestedDataset.title);

        if (this.suggestedDataset.title !== '' && (validDOI || validURL)) {
            return true;
        }
        return false;
    }
}
