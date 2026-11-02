import { MediaMatcher } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    ConfirmationDialogComponent,
    ConfirmationDialogData,
} from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { DatasetCreationDetailComponent } from '../dataset-creation-detail-component/dataset-creation-detail.component';
import { FormGroup } from '@angular/forms';
import { ZenodoSimpleDataset } from '@app/shared/interfaces/dataset.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import {
    UiTableComponent,
    UiTableColumn,
} from '@app/shared/components/ui/ui-table/ui-table.component';
import { UiTableCellDirective } from '@app/shared/directives/ui-table-cell.directive';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';
import { UiCheckboxComponent } from '@app/shared/components/ui/ui-checkbox/ui-checkbox.component';

export interface DatasetTableRow {
    doi: string;
    source: string;
    name: string;
    forcePull: boolean;
}

@Component({
    selector: 'app-datasets-list',
    templateUrl: './datasets-list.component.html',
    styleUrls: ['./datasets-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        NgClass,
        TranslatePipe,
        UiButtonComponent,
        UiTableComponent,
        UiTableCellDirective,
        UiCheckboxComponent,
    ],
})
export class DatasetsListComponent implements OnInit {
    dialog = inject(MatDialog);
    confirmationDialog = inject(MatDialog);
    private readonly snackbarService = inject(SnackbarService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private readonly media = inject(MediaMatcher);

    @Input() storageConfFormGroup!: FormGroup;
    @Output() datasetAdded = new EventEmitter<ZenodoSimpleDataset>();
    @Output() datasetDeleted = new EventEmitter<ZenodoSimpleDataset>();
    @Output() datasetPullChanged = new EventEmitter<ZenodoSimpleDataset>();

    columns: UiTableColumn<DatasetTableRow>[] = [
        { key: 'name', label: 'CATALOG.CONF-FORMS.DATA.TABLE.NAME' },
        {
            key: 'source',
            label: 'CATALOG.CONF-FORMS.DATA.TABLE.SOURCE',
            width: '100px',
            align: 'center',
        },
        {
            key: 'forcePull',
            label: 'CATALOG.CONF-FORMS.DATA.TABLE.FORCE-PULL',
            width: '150px',
            align: 'center',
        },
        {
            key: 'actions',
            label: 'CATALOG.CONF-FORMS.DATA.TABLE.ACTIONS',
            width: '110px',
            align: 'center',
        },
    ];

    datasets: DatasetTableRow[] = [];
    mobileQuery: MediaQueryList;
    private readonly _mobileQueryListener: () => void;

    constructor() {
        const changeDetectorRef = this.changeDetectorRef;
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    ngOnInit(): void {
        this.datasets = [];
    }

    openAddDatasetDialog(): void {
        const width = this.mobileQuery.matches ? '300px' : '800px';

        const dialogRef = this.dialog.open(DatasetCreationDetailComponent, {
            data: { storageConfFormGroup: this.storageConfFormGroup },
            width: width,
            autoFocus: false,
            restoreFocus: false,
            panelClass: 'ui-dialog-panel',
        });

        const subscribeAddDialog =
            dialogRef.componentInstance.onSubmitDataset.subscribe(
                (data: ZenodoSimpleDataset) => {
                    this.addDataset(data);
                    dialogRef.componentInstance.selectedTab = 0;
                    dialogRef.componentInstance.dialogLoading = false;
                }
            );

        dialogRef
            .afterClosed()
            .subscribe(() => subscribeAddDialog.unsubscribe());
    }

    changeForcePull(checked: boolean, row: DatasetTableRow) {
        const dataset = this.datasets.find((d) => d.doi === row.doi);
        if (dataset) {
            dataset.forcePull = checked;
            this.datasetPullChanged.emit({
                doiOrUrl: dataset.doi,
                title: dataset.name,
                source: dataset.source,
                force_pull: dataset.forcePull,
            });
        }
    }

    addDataset(dataset: ZenodoSimpleDataset) {
        if (this.datasets.some((d) => d.doi === dataset.doiOrUrl)) {
            this.snackbarService.openError(
                'Dataset with reference ' + dataset.doiOrUrl + ' already exists'
            );
        } else if (this.datasets.length === 5) {
            this.snackbarService.openError(
                "Can't add more than 5 datasets in a single deployment"
            );
        } else {
            this.datasets = [
                ...this.datasets,
                {
                    doi: dataset.doiOrUrl,
                    source: dataset.source,
                    name: dataset.title,
                    forcePull: dataset.force_pull,
                },
            ];
            this.datasetAdded.emit(dataset);
            this.snackbarService.openSuccess(
                'Dataset added with reference ' + dataset.doiOrUrl
            );
        }
    }

    removeDataset(e: MouseEvent, row: DatasetTableRow) {
        e.stopPropagation();
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: {
                    title: 'CATALOG.CONF-FORMS.DATA.DATASETS.DELETE',
                    subtitlePrefix:
                        'CATALOG.CONF-FORMS.DATA.DATASETS.DELETE-PREFIX',
                    subtitleHighlight: row.name,
                    subtitleSuffix:
                        'CATALOG.CONF-FORMS.DATA.DATASETS.DELETE-SUFFIX',
                    optionA: 'GENERAL.CANCEL',
                    optionB: 'CATALOG.CONF-FORMS.DATA.DATASETS.DELETE-OPTION',
                } as ConfirmationDialogData,
                panelClass: 'ui-dialog-panel',
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.datasets = this.datasets.filter(
                        (obj) => obj.doi !== row.doi
                    );
                    this.datasetDeleted.emit({
                        doiOrUrl: row.doi,
                        title: row.name,
                        source: row.source,
                        force_pull: row.forcePull,
                    });
                }
            });
    }
}
