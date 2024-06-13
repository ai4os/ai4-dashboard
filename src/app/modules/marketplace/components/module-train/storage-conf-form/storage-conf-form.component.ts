import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormGroupDirective,
    Validators,
} from '@angular/forms';
import { ZenodoService } from '@app/modules/marketplace/services/zenodo-service/zenodo.service';
import {
    ZenodoDataset,
    ZenodoDatasetVersion,
} from '@app/shared/interfaces/dataset.interface';
import {
    ModuleStorageConfiguration,
    confObject,
} from '@app/shared/interfaces/module.interface';

const mockedConfObject: confObject = {
    name: '',
    value: '',
    description: '',
};
@Component({
    selector: 'app-storage-conf-form',
    templateUrl: './storage-conf-form.component.html',
    styleUrls: ['./storage-conf-form.component.scss'],
})
export class StorageConfFormComponent implements OnInit {
    constructor(
        private ctrlContainer: FormGroupDirective,
        private fb: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private zenodoService: ZenodoService
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    parentForm!: FormGroup;

    storageConfFormGroup = this.fb.group({
        rcloneConfInput: [''],
        storageUrlInput: [''],
        rcloneVendorSelect: [''],
        rcloneUserInput: [''],
        rclonePasswordInput: [''],
        zenodoDatasetSelect: new FormControl({ value: '', disabled: true }),
        zenodoVersionSelect: new FormControl({ value: '', disabled: true }),
        //zenodoRecordIdInput: [''],
        zenodoForcePullToggle: new FormControl({
            value: false,
            disabled: true,
        }),
    });

    protected _defaultFormValues: ModuleStorageConfiguration = {
        rclone_conf: mockedConfObject,
        rclone_url: mockedConfObject,
        rclone_vendor: mockedConfObject,
        rclone_user: mockedConfObject,
        rclone_password: mockedConfObject,
        zenodo_record_id: mockedConfObject,
        zenodo_force_pull: mockedConfObject,
    };

    protected _showHelp = false;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

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

            this.storageConfFormGroup
                .get('zenodoDatasetSelect')
                ?.setValue(defaultFormValues.zenodo_record_id.value as string);
            this.setZenodoDatasetOptions();

            this.storageConfFormGroup.get('zenodoVersionSelect')?.setValue('');

            this.storageConfFormGroup
                .get('zenodoForcePullToggle')
                ?.setValue(
                    defaultFormValues.zenodo_force_pull.value as boolean
                );
        }
    }

    datasetsLength = 0;
    datasets: ZenodoDataset[] = [];
    versionsLength = 0;
    versions: ZenodoDatasetVersion[] = [];

    hidePassword = true;

    rcloneVendorOptions: { value: string; viewValue: string }[] = [];
    zenodoDatasetOptions: { value: string; viewValue: string }[] = [];
    zenodoDatasetVersions: { value: string; viewValue: string }[] = [];

    ngOnInit(): void {
        this.parentForm = this.ctrlContainer.form;
        this.parentForm.addControl(
            'storageConfForm',
            this.storageConfFormGroup
        );
    }

    datasetSelectChange() {
        const datasetSelect = this.storageConfFormGroup.get(
            'zenodoDatasetSelect'
        )!;
        const rcloneUser = this.storageConfFormGroup.get('rcloneUserInput')!;
        const rclonePassword = this.storageConfFormGroup.get(
            'rclonePasswordInput'
        )!;

        if (datasetSelect.value) {
            rcloneUser.setValidators([Validators.required]);
            rclonePassword.setValidators([Validators.required]);
            this.storageConfFormGroup.get('zenodoForcePullToggle')?.enable();
            this.storageConfFormGroup.get('zenodoVersionSelect')?.enable();
            this.setZenodoDatasetVersions(datasetSelect.value);
        } else {
            rcloneUser.setValidators(null);
            rclonePassword.setValidators(null);
            this.storageConfFormGroup.get('zenodoForcePullToggle')?.disable();
            this.storageConfFormGroup.get('zenodoVersionSelect')?.disable();
        }

        rcloneUser.updateValueAndValidity();
        rclonePassword.updateValueAndValidity();
    }

    setZenodoDatasetOptions() {
        this.zenodoService.getDatasets().subscribe({
            next: (datasets) => {
                this.convertToSimpleDatasets(datasets);
                this.zenodoDatasetOptions.push({
                    value: '',
                    viewValue: 'None',
                });
                this.datasets.forEach((option: ZenodoDataset) => {
                    this.zenodoDatasetOptions.push({
                        value: option.id,
                        viewValue: option.title,
                    });
                });
            },
            error: () => {
                this.storageConfFormGroup.get('zenodoDatasetSelect')?.disable();
            },
        });
    }

    convertToSimpleDatasets(datasets: any) {
        this.datasetsLength = datasets.hits.total;
        if (this.datasetsLength != 0) {
            this.storageConfFormGroup.get('zenodoDatasetSelect')?.enable();
            datasets.hits.hits.forEach((hit: any) => {
                const dataset: ZenodoDataset = {
                    id: hit.id,
                    created: hit.created,
                    doi_url: hit.doi_url,
                    title: hit.title,
                    doi: hit.doi,
                    description: hit.metadata.description,
                    creators: this.setCreators(hit.metadata.creators),
                    keywords: hit.metadata.keywords,
                    communities: this.setCommunities(hit.metadata.communities),
                };
                this.datasets.push(dataset);
            });
        } else {
            this.storageConfFormGroup.get('zenodoDatasetSelect')?.disable();
        }
    }

    setCreators(creators: any): string[] {
        const creatorsList: string[] = [];
        creators.forEach((c: any) => {
            creatorsList.push(c.name);
        });
        return creatorsList;
    }

    setCommunities(communities: any): string[] {
        const communitiesList: string[] = [];
        communities.forEach((c: any) => {
            communitiesList.push(c.id);
        });
        return communitiesList;
    }

    setZenodoDatasetVersions(id: string) {
        this.zenodoService.getDatasetVersions(id).subscribe({
            next: (versions) => {
                this.versions = [];
                this.zenodoDatasetVersions = [];
                this.convertToSimpleVersions(versions);
                this.versions.forEach((version: ZenodoDatasetVersion) => {
                    this.zenodoDatasetVersions.push({
                        value: version.id,
                        viewValue: version.version,
                    });
                });
                this.storageConfFormGroup
                    .get('zenodoVersionSelect')
                    ?.setValue(this.zenodoDatasetVersions[0].value);
            },
            error: () => {
                this.storageConfFormGroup.get('zenodoVersionSelect')?.disable();
            },
        });
    }

    convertToSimpleVersions(versions: any) {
        this.versionsLength = versions.hits.total;
        if (this.datasetsLength != 0) {
            versions.hits.hits.forEach((hit: any) => {
                const datasetVersion: ZenodoDatasetVersion = {
                    id: hit.id,
                    version: hit.metadata.version,
                    title: hit.title,
                    doi: hit.doi,
                    lastest: hit.metadata.relations.version[0].is_last,
                };
                this.versions.push(datasetVersion);
                this.storageConfFormGroup.get('zenodoVersionSelect')?.enable();
            });
        } else {
            this.storageConfFormGroup.get('zenodoVersionSelect')?.disable();
        }
    }
}
