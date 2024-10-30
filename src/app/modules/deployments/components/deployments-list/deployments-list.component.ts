import { SelectionModel } from '@angular/cdk/collections';
import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { DeploymentsService } from '../../services/deployments-service/deployments.service';
import { DeploymentDetailComponent } from '../deployment-detail/deployment-detail.component';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { getDeploymentBadge } from '../../utils/deployment-badge';
import {
    Deployment,
    statusReturn,
} from '@app/shared/interfaces/deployment.interface';
import { Subject, switchMap, takeUntil, timer } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import {
    SnapshotService,
    StatusReturnSnapshot,
} from '../../services/snapshots-service/snapshot.service';

export interface TableColumn {
    columnDef: string;
    header: string;
    hidden?: boolean;
}

interface deploymentTableRow {
    uuid: string;
    name: string;
    status: string;
    containerName: string;
    gpus: string | number;
    creationTime: string;
    endpoints?: { [index: string]: string } | undefined;
    mainEndpoint: string;
    error_msg?: string;
}

@Component({
    selector: 'app-deployments-list',
    templateUrl: './deployments-list.component.html',
    styleUrls: ['./deployments-list.component.scss'],
})
export class DeploymentsListComponent implements OnInit, OnDestroy {
    constructor(
        public dialog: MatDialog,
        private deploymentsService: DeploymentsService,
        private snackbarService: SnackbarService,
        private snapshotService: SnapshotService,
        public confirmationDialog: MatDialog,
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
    isLoading = false;

    columns: Array<TableColumn> = [
        { columnDef: 'uuid', header: '', hidden: true },
        { columnDef: 'name', header: 'DEPLOYMENTS.DEPLOYMENT-NAME' },
        { columnDef: 'status', header: 'DEPLOYMENTS.STATUS' },
        { columnDef: 'containerName', header: 'DEPLOYMENTS.CONTAINER-NAME' },
        { columnDef: 'gpus', header: 'DEPLOYMENTS.GPUS' },
        { columnDef: 'creationTime', header: 'DEPLOYMENTS.CREATION-TIME' },
        { columnDef: 'endpoints', header: '', hidden: true },
        { columnDef: 'actions', header: 'DEPLOYMENTS.ACTIONS' },
    ];
    dataset: Array<deploymentTableRow> = [];

    dataSource!: MatTableDataSource<deploymentTableRow>;
    selection = new SelectionModel<deploymentTableRow>(true, []);
    displayedColumns: string[] = [];
    private unsub = new Subject<void>();

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

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

    removeDeployment(e: MouseEvent, row: deploymentTableRow) {
        e.stopPropagation();
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: `Are you sure you want to delete this deployment?`,
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    const uuid = row.uuid;
                    this.deploymentsService
                        .deleteDeploymentByUUID(uuid)
                        .subscribe({
                            next: (response: statusReturn) => {
                                if (
                                    response &&
                                    response['status'] == 'success'
                                ) {
                                    const itemIndex = this.dataset.findIndex(
                                        (obj) => obj['uuid'] === uuid
                                    );
                                    this.dataset.splice(itemIndex, 1);
                                    this.dataSource =
                                        new MatTableDataSource<deploymentTableRow>(
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
                                    'Error deleting deployment with uuid: ' +
                                        uuid
                                );
                            },
                        });
                }
            });
    }

    getDeploymentsList() {
        this.isLoading = true;
        timer(0, 5000)
            .pipe(
                takeUntil(this.unsub),
                switchMap(() => this.deploymentsService.getDeployments())
            )
            .subscribe((deploymentsList: Deployment[]) => {
                this.dataset = [];
                this.isLoading = false;
                deploymentsList.forEach((deployment: Deployment) => {
                    const row: deploymentTableRow = {
                        uuid: deployment.job_ID,
                        name: deployment.title,
                        status: deployment.status,
                        containerName: deployment.docker_image,
                        gpus: '-',
                        creationTime: deployment.submit_time,
                        endpoints: deployment.endpoints,
                        mainEndpoint: deployment.main_endpoint,
                    };
                    if (deployment.error_msg) {
                        row.error_msg = deployment.error_msg;
                    }
                    if (
                        deployment.resources &&
                        Object.keys(deployment.resources).length !== 0
                    ) {
                        row.gpus = deployment.resources.gpu_num;
                    }
                    this.dataset.push(row);
                });
                this.dataSource = new MatTableDataSource<deploymentTableRow>(
                    this.dataset
                );
            });
    }

    isDeploymentRunning(row: deploymentTableRow) {
        return row.status === 'running';
    }

    getDeploymentEndpoints(row: deploymentTableRow) {
        return row.endpoints;
    }

    getMainEndpoint(row: deploymentTableRow) {
        const mainEndpoint = row.mainEndpoint;
        if (row.endpoints && row.endpoints[mainEndpoint]) {
            return row.endpoints[mainEndpoint];
        } else {
            return '';
        }
    }

    hasDeploymentErrors(row: deploymentTableRow) {
        return row.error_msg;
    }

    returnDeploymentBadge(status: string) {
        return getDeploymentBadge(status);
    }

    openDeploymentDetailDialog(row: deploymentTableRow): void {
        const width = this.mobileQuery.matches ? '300px' : '650px';
        this.dialog.open(DeploymentDetailComponent, {
            data: { uuid: row.uuid, isTool: false },
            width: width,
            maxWidth: width,
            minWidth: width,
            autoFocus: false,
            restoreFocus: false,
        });
    }

    createSnapshot(row: deploymentTableRow) {
        this.snapshotService.createSnapshot(row.uuid).subscribe({
            next: (response: StatusReturnSnapshot) => {
                if (response && response['status'] == 'success') {
                    // TODO update snapshots table
                    this.snackbarService.openSuccess(
                        'Successfully created snapshot of deployment with uuid: ' +
                            row.uuid
                    );
                } else {
                    this.snackbarService.openError(
                        'Error creating snapshot of deployment with uuid: ' +
                            row.uuid
                    );
                }
            },
            error: () => {
                this.snackbarService.openError(
                    'Error creating snapshot of deployment with uuid: ' +
                        row.uuid
                );
            },
        });
    }

    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) {
        // This example uses English messages. If your application supports
        // multiple language, you would internationalize these strings.
        // Furthermore, you can customize the message to add additional
        // details about the values being sorted.
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    isSticky(columnDef: string): boolean {
        return columnDef === 'name' ? true : false;
    }

    ngOnInit(): void {
        this.dataset = [];
        this.getDeploymentsList();
        // set checkbox column
        //this.displayedColumns.push("select");

        // set table columns
        this.displayedColumns = this.displayedColumns.concat(
            this.columns.filter((x) => !x.hidden).map((x) => x.columnDef)
        ); // pre-fix static
        // add action column
        this.dataSource = new MatTableDataSource<deploymentTableRow>(
            this.dataset
        );

        // set pagination
        //this.dataSource.paginator = this.paginator;
    }

    ngOnDestroy(): void {
        this.unsub.next();
        this.unsub.complete();
    }
}
