import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MediaMatcher } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { DatasetCreationDetailComponent } from '../dataset-creation-detail-component/dataset-creation-detail.component';
import { FormGroup } from '@angular/forms';
import { ZenodoSimpleDataset } from '@app/shared/interfaces/dataset.interface';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';

export interface TableColumn {
    columnDef: string;
    header: string;
    hidden?: boolean;
}

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
})
export class DatasetsListComponent implements OnInit {
    constructor(
        public dialog: MatDialog,
        public confirmationDialog: MatDialog,
        private snackbarService: SnackbarService,
        private _liveAnnouncer: LiveAnnouncer,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    @ViewChild(MatSort) set matSort(sort: MatSort) {
        this.dataSource.sort = sort;
    }

    @Input()
        storageConfFormGroup!: FormGroup;

    @Output() datasetAdded = new EventEmitter<ZenodoSimpleDataset>();
    @Output() datasetDeleted = new EventEmitter<ZenodoSimpleDataset>();
    @Output() datasetPullChanged = new EventEmitter<ZenodoSimpleDataset>();

    columns: Array<TableColumn> = [
        { columnDef: 'id', header: '', hidden: true },
        {
            columnDef: 'name',
            header: 'MODULES.MODULE-TRAIN.DATA-CONF-FORM.TABLE.NAME',
        },
        {
            columnDef: 'source',
            header: 'MODULES.MODULE-TRAIN.DATA-CONF-FORM.TABLE.SOURCE',
        },
        {
            columnDef: 'forcePull',
            header: 'MODULES.MODULE-TRAIN.DATA-CONF-FORM.TABLE.FORCE-PULL',
        },
        {
            columnDef: 'actions',
            header: 'MODULES.MODULE-TRAIN.DATA-CONF-FORM.TABLE.ACTIONS',
        },
    ];

    datasets: Array<DatasetTableRow> = [];
    dataSource!: MatTableDataSource<DatasetTableRow>;
    displayedColumns: string[] = [];

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    ngOnInit(): void {
        this.datasets = [];
        this.displayedColumns = this.displayedColumns.concat(
            this.columns.filter((x) => !x.hidden).map((x) => x.columnDef)
        );
        this.dataSource = new MatTableDataSource<DatasetTableRow>(
            this.datasets
        );
    }

    isSticky(columnDef: string): boolean {
        return columnDef === 'name' ? true : false;
    }

    announceSortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(
                `Sorted ${sortState.direction} ending`
            );
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    openAddDatasetDialog(): void {
        const width = this.mobileQuery.matches ? '300px' : '800px';
        const height = this.mobileQuery.matches ? '300px' : '446px';

        const dialogRef = this.dialog.open(DatasetCreationDetailComponent, {
            data: { storageConfFormGroup: this.storageConfFormGroup },
            width: width,
            height: height,
            autoFocus: false,
            restoreFocus: false,
        });

        const subscribeAddDialog =
            dialogRef.componentInstance.onSubmitDataset.subscribe(
                (data: ZenodoSimpleDataset) => {
                    this.addDataset(data);
                    dialogRef.componentInstance.selectedTab = 0;
                    dialogRef.componentInstance.dialogLoading = false;
                }
            );

        dialogRef.afterClosed().subscribe((result) => {
            subscribeAddDialog.unsubscribe();
        });
    }

    changeForcePull(event: MatCheckboxChange, row: DatasetTableRow) {
        const dataset = this.datasets.find((d) => d.doi === row.doi);
        dataset!.forcePull = event.checked;
        const d: ZenodoSimpleDataset = {
            doiOrUrl: dataset!.doi,
            title: dataset!.name,
            source: dataset!.source,
            force_pull: dataset!.forcePull,
        };
        this.datasetPullChanged.emit(d);
    }

    addDataset(dataset: ZenodoSimpleDataset) {
        if (this.datasets.find((d) => d.doi === dataset.doiOrUrl)) {
            this.snackbarService.openError(
                'Dataset with reference ' + dataset.doiOrUrl + ' already exists'
            );
        } else if (this.datasets.length === 5) {
            this.snackbarService.openError(
                "Can't add more than 5 datasets in a single deployment"
            );
        } else {
            this.datasets.push({
                doi: dataset.doiOrUrl,
                source: dataset.source,
                name: dataset.title,
                forcePull: dataset.force_pull,
            });
            this.dataSource = new MatTableDataSource<DatasetTableRow>(
                this.datasets
            );
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
                data: `Are you sure you want to delete this dataset?`,
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    const doi = row.doi;
                    this.dataSource = new MatTableDataSource<DatasetTableRow>(
                        this.datasets
                    );
                    const itemIndex = this.datasets.findIndex(
                        (obj) => obj['doi'] === doi
                    );
                    const d: ZenodoSimpleDataset = {
                        doiOrUrl: row.doi,
                        title: row.name,
                        source: row.source,
                        force_pull: row.forcePull,
                    };
                    this.datasetDeleted.emit(d);
                    this.datasets.splice(itemIndex, 1);
                    this.dataSource = new MatTableDataSource<DatasetTableRow>(
                        this.datasets
                    );
                }
            });
    }
}
