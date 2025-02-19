import { SelectionModel } from '@angular/cdk/collections';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import {
    DeploymentTableRow,
    Snapshot,
    TableColumn,
} from '@app/shared/interfaces/deployment.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { SecretManagementDetailComponent } from '@app/modules/deployments/components/secret-management-detail/secret-management-detail.component';
import {
    SnapshotService,
    StatusReturnSnapshot,
} from '@app/modules/deployments/services/snapshots-service/snapshot.service';
import {
    getDeploymentBadge,
    getSnapshotBadge,
} from '@app/modules/deployments/utils/deployment-badge';
import { Router } from '@angular/router';
import { SnapshotDetailComponent } from '@app/modules/deployments/components/snapshot-detail/snapshot-detail.component';

@Component({
    selector: 'app-deployments-table',
    templateUrl: './deployments-table.component.html',
    styleUrl: './deployments-table.component.scss',
})
export class DeploymentsTableComponent implements OnInit, OnDestroy {
    constructor(
        public dialog: MatDialog,
        private snackbarService: SnackbarService,
        private snapshotService: SnapshotService,
        public confirmationDialog: MatDialog,
        private media: MediaMatcher,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        this.dataSource.sort = sort;
    }
    @Input() cardName = '';
    @Input() cardIcon?: string;
    @Input() cardImage?: string;
    @Input() showCardActions = false;
    @Input() deploymentType = 'module';
    @Input() isLoading = false;
    @Input() dataset: Array<DeploymentTableRow> = [];
    @Input() dataSource!: MatTableDataSource<DeploymentTableRow>;

    @Output() showElementInfo = new EventEmitter<string>();
    @Output() deleteElement = new EventEmitter<string>();

    @Input() columns: Array<TableColumn> = [
        { columnDef: 'uuid', header: '', hidden: true },
        { columnDef: 'name', header: 'DEPLOYMENTS.DEPLOYMENT-NAME' },
        { columnDef: 'status', header: 'DEPLOYMENTS.STATUS' },
        { columnDef: 'containerName', header: 'DEPLOYMENTS.CONTAINER-NAME' },
        { columnDef: 'gpus', header: 'DEPLOYMENTS.GPUS' },
        { columnDef: 'creationTime', header: 'DEPLOYMENTS.CREATION-TIME' },
        { columnDef: 'endpoints', header: '', hidden: true },
        { columnDef: 'description', header: '', hidden: true },
        { columnDef: 'actions', header: 'DEPLOYMENTS.ACTIONS' },
    ];

    selection = new SelectionModel<DeploymentTableRow>(true, []);
    displayedColumns: string[] = [];
    private unsub = new Subject<void>();

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    ngOnInit(): void {
        this.displayedColumns = this.displayedColumns.concat(
            this.columns.filter((x) => !x.hidden).map((x) => x.columnDef)
        );
    }

    openDeploymentDetailDialog(row: DeploymentTableRow): void {
        if (this.deploymentType === 'snapshot') {
            const snapshot: Snapshot = {
                snapshot_ID: row.snapshot_ID!,
                title: row.name,
                status: row.status!,
                submit_time: row.creationTime,
                docker_image: '',
                size: +row.size!,
                nomad_ID: '',
                description: row.description,
                error_msg: row.error_msg,
            };
            this.openSnapshotDetailDialog(snapshot);
        } else {
            this.showElementInfo.emit(row.uuid);
        }
    }

    removeDeployment(e: MouseEvent, row: DeploymentTableRow) {
        e.stopPropagation();
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data:
                    'Are you sure you want to delete this ' +
                    this.deploymentType +
                    '?',
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.deleteElement.emit(row.uuid);
                }
            });
    }

    openToolSecretsDialog(row: DeploymentTableRow): void {
        const width = this.mobileQuery.matches ? '300px' : '650px';
        this.dialog.open(SecretManagementDetailComponent, {
            data: { uuid: row.uuid, name: row.name },
            width: width,
            maxWidth: width,
            minWidth: width,
            autoFocus: false,
            restoreFocus: false,
        });
    }

    openSnapshotDetailDialog(snapshot: Snapshot): void {
        const width = this.mobileQuery.matches ? '300px' : '650px';
        this.dialog.open(SnapshotDetailComponent, {
            data: { snapshot: snapshot },
            width: width,
            maxWidth: width,
            minWidth: width,
            autoFocus: false,
            restoreFocus: false,
        });
    }

    isDeploymentRunning(row: DeploymentTableRow) {
        return row.status === 'running';
    }

    isFederatedServer(row: DeploymentTableRow) {
        return row.containerName?.includes('ai4os-federated-server');
    }

    getDeploymentEndpoints(row: DeploymentTableRow) {
        return row.endpoints;
    }

    getMainEndpoint(row: DeploymentTableRow) {
        if (this.deploymentType === 'try-me') {
            return row.endpoints?.ui;
        } else {
            const mainEndpoint = row.mainEndpoint;
            if (mainEndpoint && row.endpoints && row.endpoints[mainEndpoint]) {
                return row.endpoints[mainEndpoint];
            } else {
                return '';
            }
        }
    }

    hasDeploymentErrors(row: DeploymentTableRow) {
        return row.error_msg;
    }

    returnDeploymentBadge(status: string) {
        let badge = getDeploymentBadge(status);
        if (this.deploymentType === 'snapshot') {
            badge = getSnapshotBadge(status);
        }
        return badge;
    }

    createSnapshot(e: MouseEvent, row: DeploymentTableRow) {
        e.stopPropagation();
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: `Are you sure you want to create a snapshot of this deployment?`,
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.snapshotService.createSnapshot(row.uuid).subscribe({
                        next: (response: StatusReturnSnapshot) => {
                            if (response && response['status'] == 'success') {
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
                        error: (error) => {
                            this.snackbarService.openError(error);
                        },
                    });
                }
            });
    }

    redeploySnapshot(e: MouseEvent, row: DeploymentTableRow) {
        e.stopPropagation();
        sessionStorage.setItem('deploymentType', this.deploymentType);
        sessionStorage.setItem('deploymentRow', JSON.stringify(row));
        this.router.navigate(['/marketplace/modules/snapshots/deploy']);
    }

    isSticky(columnDef: string): boolean {
        return columnDef === 'name' ? true : false;
    }

    ngOnDestroy(): void {
        this.unsub.next();
        this.unsub.complete();
    }
}
