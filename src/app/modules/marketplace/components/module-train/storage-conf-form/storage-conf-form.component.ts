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
import { ZenodoDataset } from '@app/shared/interfaces/dataset.interface';
import {
    ModuleStorageConfiguration,
    confObjectRange,
} from '@app/shared/interfaces/module.interface';

const mockedConfObject: confObjectRange = {
    range: [],
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
        zenodoVersionSelect: [''],
        zenodoRecordIdInput: [''],
        zenodoForcePullToggle: [''],
    });

    protected _defaultFormValues: ModuleStorageConfiguration = {
        rclone_conf: mockedConfObject,
        rclone_url: mockedConfObject,
        rclone_vendor: mockedConfObject,
        rclone_user: mockedConfObject,
        rclone_password: mockedConfObject,
        zenodo_record_id: mockedConfObject,
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
        }
    }

    datasetsLength = 0;
    datasets: ZenodoDataset[] = [];
    hidePassword = true;
    rcloneVendorOptions: { value: string; viewValue: string }[] = [];
    zenodoDatasetOptions: { value: string; viewValue: string }[] = [];

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
        } else {
            rcloneUser.setValidators(null);
            rclonePassword.setValidators(null);
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
}
