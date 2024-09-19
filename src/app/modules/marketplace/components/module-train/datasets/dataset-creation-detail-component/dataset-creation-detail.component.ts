import { MediaMatcher } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    OnInit,
    Optional,
} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    ValidationErrors,
    ValidatorFn,
} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { ZenodoService } from '@app/modules/marketplace/services/zenodo-service/zenodo.service';
import {
    ZenodoCommunity,
    ZenodoDataset,
    ZenodoDatasetVersion,
    ZenodoSimpleDataset,
} from '@app/shared/interfaces/dataset.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { Observable, map, startWith } from 'rxjs';

export function doiValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const regexPattern = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
        const valid = regexPattern.test(control.value);
        return valid ? null : { invalidDOI: true };
    };
}

@Component({
    selector: 'app-dataset-creation-detail',
    templateUrl: './dataset-creation-detail.component.html',
    styleUrls: ['./dataset-creation-detail.component.scss'],
})
export class DatasetCreationDetailComponent implements OnInit {
    constructor(
        private zenodoService: ZenodoService,
        public dialogRef: MatDialogRef<DatasetCreationDetailComponent>,
        public confirmationDialog: MatDialog,
        private appConfigService: AppConfigService,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private fb: FormBuilder,
        private snackbarService: SnackbarService,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: ZenodoSimpleDataset
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
        this.community =
            this.appConfigService.voName == 'vo.imagine-ai.eu'
                ? 'iMagine project'
                : 'Artificial Intelligence for the European Open Science Cloud (AI4EOSC)';
    }

    zenodoFormGroup = this.fb.group({
        zenodoCommunitySelect: new FormControl({ value: '', disabled: true }),
        zenodoDatasetSelect: new FormControl({ value: '', disabled: true }),
        zenodoVersionSelect: new FormControl({ value: '', disabled: true }),
    });

    doiFormGroup = this.fb.group({
        doiInput: ['', [doiValidator()]],
    });

    selectedTab = 0;
    dialogLoading = false;
    protected datasetsLoading = false;
    protected versionsLoading = false;

    protected datasetsLength = 0;
    private datasets: ZenodoDataset[] = [];
    private versions: ZenodoDatasetVersion[] = [];
    private communities: ZenodoCommunity[] = [];
    private community = '';

    protected zenodoCommunitiesOptions: { value: string; viewValue: string }[] =
        [];
    protected filteredCommunityOptions!: Observable<
        { value: string; viewValue: string }[]
    >;
    protected zenodoDatasetOptions: { value: string; viewValue: string }[] = [];
    protected zenodoDatasetVersions: { value: string; viewValue: string }[] =
        [];

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    onSubmitDataset = new EventEmitter<ZenodoSimpleDataset>();

    ngOnInit(): void {
        this.dialogLoading = true;
        this.setZenodoCommunities();
        this.filteredCommunityOptions = this.zenodoFormGroup
            .get('zenodoCommunitySelect')!
            .valueChanges.pipe(
                startWith(''),
                map((value) => this._filter(value || ''))
            );
    }

    private _filter(value: string): { value: string; viewValue: string }[] {
        const filterValue = value.toLowerCase();
        return this.zenodoCommunitiesOptions.filter((option) =>
            option.viewValue.toLowerCase().includes(filterValue)
        );
    }

    setZenodoCommunities() {
        this.zenodoService
            .getCommunities()
            .subscribe((data: ZenodoCommunity[]) => {
                this.communities = data;
                this.communities.forEach((option: ZenodoCommunity) => {
                    this.zenodoCommunitiesOptions.push({
                        value: option.link,
                        viewValue: option.title,
                    });
                });
                this.zenodoFormGroup.get('zenodoCommunitySelect')?.enable();
                const selectedOption = this.zenodoCommunitiesOptions.find(
                    (option) => option.viewValue === this.community
                );
                if (selectedOption) {
                    this.zenodoFormGroup
                        .get('zenodoCommunitySelect')
                        ?.setValue(selectedOption.viewValue);
                    this.communitySelectChange();
                }
                this.dialogLoading = false;
            });
    }

    communitySelectChange() {
        const communitySelect = this.zenodoFormGroup.get(
            'zenodoCommunitySelect'
        )!;
        const datasetSelect = this.zenodoFormGroup.get('zenodoDatasetSelect')!;
        const versionSelect = this.zenodoFormGroup.get('zenodoVersionSelect')!;
        const community = this.zenodoCommunitiesOptions.find(
            (c) => c.viewValue == communitySelect.value
        );

        this.clearZenodoForm();

        if (community) {
            this.setZenodoDatasetOptions(community.value);
            this.datasetsLoading = true;
        } else {
            this.zenodoFormGroup.get('zenodoDatasetSelect')?.disable();
            this.datasetsLoading = false;
        }

        datasetSelect.updateValueAndValidity();
        versionSelect.updateValueAndValidity();
    }

    setZenodoDatasetOptions(community: string) {
        const lastSlashIndex = community.lastIndexOf('/');
        const communityName = community.substring(lastSlashIndex + 1);
        this.zenodoService.getDatasets(communityName).subscribe({
            next: (datasets) => {
                this.convertToSimpleDatasets(datasets);
                this.zenodoDatasetOptions = [];
                this.datasets.forEach((option: ZenodoDataset) => {
                    this.zenodoDatasetOptions.push({
                        value: option.id,
                        viewValue: option.title,
                    });
                });
                this.datasetsLoading = false;
                if (this.zenodoDatasetOptions.length > 0) {
                    this.zenodoFormGroup.get('zenodoDatasetSelect')?.enable();
                } else {
                    this.zenodoFormGroup.get('zenodoDatasetSelect')?.disable();
                }
            },
            error: () => {
                this.zenodoFormGroup.get('zenodoDatasetSelect')?.disable();
                this.snackbarService.openError('Error retrieving datasets');
            },
        });
    }

    convertToSimpleDatasets(datasets: any) {
        this.datasetsLength = datasets.hits.total;
        if (this.datasetsLength != 0) {
            this.zenodoFormGroup.get('zenodoDatasetSelect')?.enable();
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
            this.zenodoFormGroup.get('zenodoDatasetSelect')?.disable();
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

    datasetSelectChange() {
        const datasetSelect = this.zenodoFormGroup.get('zenodoDatasetSelect')!;
        const versionSelect = this.zenodoFormGroup.get('zenodoVersionSelect')!;
        if (datasetSelect.value) {
            this.setZenodoDatasetVersions(datasetSelect.value);
            this.versionsLoading = true;
        } else {
            this.zenodoFormGroup.get('zenodoVersionSelect')?.disable();
            this.versionsLoading = false;
        }
        versionSelect.updateValueAndValidity();
    }

    setZenodoDatasetVersions(id: string) {
        this.zenodoFormGroup.get('zenodoVersionSelect')?.disable();
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
                this.versionsLoading = false;
                this.zenodoFormGroup
                    .get('zenodoVersionSelect')
                    ?.setValue(this.zenodoDatasetVersions[0].value);
                this.zenodoFormGroup.get('zenodoVersionSelect')?.enable();
            },
            error: () => {
                this.zenodoFormGroup.get('zenodoVersionSelect')?.disable();
                this.snackbarService.openError(
                    'Error retrieving dataset versions'
                );
            },
        });
    }

    convertToSimpleVersions(versions: any) {
        if (this.datasetsLength != 0) {
            versions.hits.hits.forEach((hit: any) => {
                const datasetVersion: ZenodoDatasetVersion = {
                    id: hit.id,
                    version: hit.metadata.version ?? 1,
                    title: hit.title,
                    doi: hit.doi,
                    lastest: hit.metadata.relations.version[0].is_last,
                };
                this.versions.push(datasetVersion);
            });
        } else {
            this.zenodoFormGroup.get('zenodoVersionSelect')?.disable();
        }
    }

    addDataset() {
        this.dialogLoading = true;
        let source = '';

        if (this.selectedTab == 0) {
            source = 'zenodo';
            const id =
                this.zenodoFormGroup.get('zenodoVersionSelect')?.value ?? '';
            this.zenodoService.getDataset(id).subscribe({
                next: (dataset) => {
                    const d = this.convertToSimpleDataset(dataset);
                    d.source = source;
                    this.onSubmitDataset.emit(d);
                    this.doiFormGroup.get('doiInput')?.setValue('');
                    this.doiFormGroup.markAsUntouched();
                },
                error: () => {
                    this.zenodoFormGroup.get('zenodoVersionSelect')?.disable();
                    this.dialogLoading = false;
                    this.snackbarService.openError(
                        'Error retrieving dataset information'
                    );
                },
            });
        } else if (this.selectedTab == 1) {
            source = 'doi';
            const doi = this.doiFormGroup.get('doiInput')?.value ?? '';
            this.zenodoFormGroup.get('zenodoCommunitySelect')?.setValue('');
            this.clearZenodoForm();
            const d: ZenodoSimpleDataset = {
                doi: doi,
                title: doi,
                source: source,
                force_pull: false,
            };
            this.onSubmitDataset.emit(d);
            this.doiFormGroup.get('doiInput')?.setValue('');
            this.doiFormGroup.markAsUntouched();
        }
    }

    convertToSimpleDataset(d: any) {
        const dataset: ZenodoSimpleDataset = {
            doi: d.doi,
            title: d.title,
            source: '',
            force_pull: false,
        };
        return dataset;
    }

    clearZenodoForm(): void {
        this.datasets = [];
        this.zenodoDatasetVersions = [];
        this.zenodoFormGroup.get('zenodoDatasetSelect')?.setValue('');
        this.zenodoFormGroup.get('zenodoVersionSelect')?.setValue('');
        this.zenodoFormGroup.get('zenodoVersionSelect')?.disable();
        this.zenodoFormGroup.get('zenodoDatasetSelect')?.disable();
    }

    tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.selectedTab = tabChangeEvent.index;
    }

    formsAreValid(): boolean {
        const communitySelect = this.zenodoFormGroup.get(
            'zenodoCommunitySelect'
        )?.value;
        const datasetSelect = this.zenodoFormGroup.get('zenodoDatasetSelect')
            ?.value;
        const versionSelect = this.zenodoFormGroup.get('zenodoVersionSelect')
            ?.value;

        if (
            (this.selectedTab == 0 &&
                communitySelect &&
                datasetSelect &&
                versionSelect) ||
            (this.selectedTab == 1 &&
                !this.doiFormGroup.get('doiInput')?.hasError('invalidDOI'))
        ) {
            return true;
        }

        return false;
    }
}
