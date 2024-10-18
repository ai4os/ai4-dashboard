import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OscarInferenceService } from '../../services/oscar-inference.service';
import { OscarService } from '@app/shared/interfaces/oscar-service.interface';
import { InferenceDetailComponent } from '../inference-detail/inference-detail.component';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';

export interface TableColumn {
    columnDef: string;
    header: string;
    hidden?: boolean;
}

interface ServiceTableRow {
    name: string;
    title: string;
    image: string;
    creationTime: string;
}

@Component({
    selector: 'app-inferences-list',
    templateUrl: './inferences-list.component.html',
    styleUrls: ['./inferences-list.component.scss'],
})
export class InferencesListComponent implements OnInit {
    constructor(
        public oscarInferenceService: OscarInferenceService,
        public dialog: MatDialog,
        public confirmationDialog: MatDialog,
        private _liveAnnouncer: LiveAnnouncer,
        private snackbarService: SnackbarService,
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

    columns: Array<TableColumn> = [
        { columnDef: 'name', header: 'INFERENCE.NAME', hidden: true },
        { columnDef: 'title', header: 'INFERENCE.TITLE' },
        { columnDef: 'image', header: 'INFERENCE.IMAGE' },
        { columnDef: 'creationTime', header: 'INFERENCE.CREATION-TIME' },
        { columnDef: 'actions', header: 'INFERENCE.ACTIONS' },
    ];
    dataset: Array<ServiceTableRow> = [];
    dataSource!: MatTableDataSource<ServiceTableRow>;
    selection = new SelectionModel<ServiceTableRow>(true, []);
    displayedColumns: string[] = [];

    isLoading = false;
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    ngOnInit(): void {
        this.dataset = [];
        this.getServicesList();
        this.displayedColumns = this.displayedColumns.concat(
            this.columns.filter((x) => !x.hidden).map((x) => x.columnDef)
        );
        this.dataSource = new MatTableDataSource<ServiceTableRow>(this.dataset);
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.data.forEach((row) => this.selection.select(row));
    }

    getServicesList() {
        this.isLoading = true;
        this.oscarInferenceService.getServices().subscribe({
            next: (servicesList: OscarService[]) => {
                this.dataset = [];
                servicesList.forEach((service: OscarService) => {
                    service.title = service.environment.Variables.PAPI_TITLE;
                    service.submit_time =
                        service.environment.Variables.PAPI_CREATED;
                    const row: ServiceTableRow = {
                        name: service.name,
                        title: service.title,
                        image: service.image,
                        creationTime: service.submit_time,
                    };
                    this.dataset.push(row);
                });
                this.dataSource = new MatTableDataSource<ServiceTableRow>(
                    this.dataset
                );
                this.isLoading = false;
            },
            error: () => {
                this.dataSource = new MatTableDataSource<ServiceTableRow>([]);
                this.isLoading = false;
            },
        });
    }

    removeService(e: MouseEvent, row: ServiceTableRow) {
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: `Are you sure you want to delete this service?`,
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.isLoading = true;
                    this.dataSource = new MatTableDataSource<ServiceTableRow>();
                    const name = row.name;
                    this.oscarInferenceService
                        .deleteServiceByName(name)
                        .subscribe({
                            next: (serviceName: string) => {
                                if (serviceName && serviceName == row.name) {
                                    const itemIndex = this.dataset.findIndex(
                                        (obj) => obj['name'] === name
                                    );
                                    this.dataset.splice(itemIndex, 1);
                                    this.dataSource =
                                        new MatTableDataSource<ServiceTableRow>(
                                            this.dataset
                                        );
                                    this.isLoading = false;
                                    this.snackbarService.openSuccess(
                                        'Successfully deleted service with name: ' +
                                            name
                                    );
                                } else {
                                    this.dataSource =
                                        new MatTableDataSource<ServiceTableRow>(
                                            this.dataset
                                        );
                                    this.isLoading = false;
                                    this.snackbarService.openError(
                                        'Error deleting service with name: ' +
                                            name
                                    );
                                }
                            },
                            error: () => {
                                this.dataSource =
                                    new MatTableDataSource<ServiceTableRow>(
                                        this.dataset
                                    );
                                this.isLoading = false;
                                this.snackbarService.openError(
                                    'Error deleting service with name: ' + name
                                );
                            },
                        });
                }
            });
    }

    openServiceDetailDialog(row: ServiceTableRow): void {
        const width = this.mobileQuery.matches ? '300px' : '650px';
        this.dialog.open(InferenceDetailComponent, {
            data: { name: row.name },
            width: width,
            maxWidth: width,
            minWidth: width,
            autoFocus: false,
            restoreFocus: false,
        });
    }

    announceSortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    isSticky(columnDef: string): boolean {
        return columnDef === 'name' ? true : false;
    }
}
