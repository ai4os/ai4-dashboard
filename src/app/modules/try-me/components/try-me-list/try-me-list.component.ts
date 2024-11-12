import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { MediaMatcher } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { TryMeService } from '../../services/try-me.service';
import { GradioDeployment } from '@app/shared/interfaces/module.interface';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { statusReturn } from '@app/shared/interfaces/deployment.interface';
import { getDeploymentBadge } from '@app/modules/deployments/utils/deployment-badge';
import { TryMeDetailComponent } from '../try-me-detail/try-me-detail.component';
import { Subject, switchMap, takeUntil, timer } from 'rxjs';

export interface TableColumn {
    columnDef: string;
    header: string;
    hidden?: boolean;
}

interface DeploymentTableRow {
    uuid: string;
    name: string;
    status: string;
    title: string;
    image: string;
    creationTime: string;
    endpoints?: { [index: string]: string } | undefined;
}

@Component({
    selector: 'app-try-me-list',
    templateUrl: './try-me-list.component.html',
    styleUrls: ['./try-me-list.component.scss'],
})
export class TryMeListComponent implements OnInit, OnDestroy {
    constructor(
        public tryMeService: TryMeService,
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
        { columnDef: 'uuid', header: '', hidden: true },
        { columnDef: 'title', header: 'INFERENCE.TITLE' },
        { columnDef: 'status', header: 'DEPLOYMENTS.STATUS' },
        { columnDef: 'image', header: 'TRY-ME.IMAGE' },
        { columnDef: 'creationTime', header: 'DEPLOYMENTS.CREATION-TIME' },
        { columnDef: 'actions', header: 'DEPLOYMENTS.ACTIONS' },
        { columnDef: 'endpoints', header: '', hidden: true },
    ];

    dataset: Array<DeploymentTableRow> = [];
    dataSource!: MatTableDataSource<DeploymentTableRow>;
    selection = new SelectionModel<DeploymentTableRow>(true, []);
    displayedColumns: string[] = [];

    isLoading = false;
    mobileQuery: MediaQueryList;

    private _mobileQueryListener: () => void;
    private unsub = new Subject<void>();

    ngOnInit(): void {
        this.dataset = [];
        this.getTryMeDeploymentsList();
        this.displayedColumns = this.displayedColumns.concat(
            this.columns.filter((x) => !x.hidden).map((x) => x.columnDef)
        );
        this.dataSource = new MatTableDataSource<DeploymentTableRow>(
            this.dataset
        );
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        if (this.isAllSelected()) {
            this.selection.clear();
        } else {
            this.dataSource.data.forEach((row) => this.selection.select(row));
        }
    }

    returnDeploymentBadge(status: string) {
        return getDeploymentBadge(status);
    }

    getTryMeDeploymentsList() {
        this.isLoading = true;

        timer(0, 5000)
            .pipe(
                takeUntil(this.unsub),
                switchMap(() => this.tryMeService.getDeploymentsGradio())
            )
            .subscribe({
                next: (deploymentsList: GradioDeployment[]) => {
                    this.dataset = [];
                    deploymentsList.forEach((deployment: GradioDeployment) => {
                        const row: DeploymentTableRow = {
                            uuid: deployment.job_ID,
                            name: deployment.name,
                            status: deployment.status,
                            title: deployment.title,
                            image: deployment.docker_image,
                            creationTime: deployment.submit_time,
                            endpoints: deployment.endpoints,
                        };
                        this.dataset.push(row);
                    });
                    this.dataSource =
                        new MatTableDataSource<DeploymentTableRow>(
                            this.dataset
                        );
                    this.isLoading = false;
                },
                error: () => {
                    this.dataSource =
                        new MatTableDataSource<DeploymentTableRow>([]);
                    this.isLoading = false;
                },
            });
    }

    removeTryMe(e: MouseEvent, row: DeploymentTableRow) {
        e.stopPropagation();
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: `Are you sure you want to delete this deployment?`,
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    const uuid = row.uuid;
                    this.tryMeService.deleteDeploymentByUUID(uuid).subscribe({
                        next: (response: statusReturn) => {
                            if (response && response['status'] == 'success') {
                                const itemIndex = this.dataset.findIndex(
                                    (obj) => obj['uuid'] === uuid
                                );
                                this.dataset.splice(itemIndex, 1);
                                this.dataSource =
                                    new MatTableDataSource<DeploymentTableRow>(
                                        this.dataset
                                    );
                                this.snackbarService.openSuccess(
                                    'Successfully deleted deployment with uuid: ' +
                                        uuid
                                );
                            } else {
                                this.snackbarService.openError(
                                    'Error deleting deployment with uuid: ' +
                                        uuid
                                );
                            }
                        },
                        error: () => {
                            this.snackbarService.openError(
                                'Error deleting deployment with uuid: ' + uuid
                            );
                        },
                    });
                }
            });
    }

    openTryMeDetailDialog(row: DeploymentTableRow): void {
        const width = this.mobileQuery.matches ? '300px' : '650px';
        this.dialog.open(TryMeDetailComponent, {
            data: { uuid: row.uuid },
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

    isDeploymentRunning(row: DeploymentTableRow) {
        return row.status === 'running';
    }

    ngOnDestroy(): void {
        this.unsub.next();
        this.unsub.complete();
    }
}
