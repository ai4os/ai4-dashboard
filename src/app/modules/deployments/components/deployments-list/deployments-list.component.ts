import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DeploymentsService } from '../../services/deployments-service/deployments.service';
import { DeploymentDetailComponent } from '../deployment-detail/deployment-detail.component';
import {
    Deployment,
    DeploymentTableRow,
    Snapshot,
    statusReturn,
    TableColumn,
} from '@app/shared/interfaces/deployment.interface';
import { Subject, switchMap, takeUntil, timer } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import {
    SnapshotService,
    StatusReturnSnapshot,
} from '../../services/snapshots-service/snapshot.service';

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
        private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

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

    isModulesTableLoading = false;
    isToolsTableLoading = false;
    isSnapshotsTableLoading = false;

    modulesDataset: Array<DeploymentTableRow> = [];
    toolsDataset: Array<DeploymentTableRow> = [];
    snapshotsDataset: Array<DeploymentTableRow> = [];

    modulesDataSource!: MatTableDataSource<DeploymentTableRow>;
    toolsDataSource!: MatTableDataSource<DeploymentTableRow>;
    snapshotsDataSource!: MatTableDataSource<DeploymentTableRow>;

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    private unsub = new Subject<void>();

    ngOnInit(): void {
        this.modulesDataset = [];
        this.modulesDataSource = new MatTableDataSource<DeploymentTableRow>(
            this.modulesDataset
        );
        this.toolsDataset = [];
        this.toolsDataSource = new MatTableDataSource<DeploymentTableRow>(
            this.toolsDataset
        );
        this.snapshotsDataset = [];
        this.snapshotsDataSource = new MatTableDataSource<DeploymentTableRow>(
            this.snapshotsDataset
        );

        this.getModulesList();
        this.getToolsList();
        this.getSnapshotsList();
    }

    /**     MODULES METHODS     **/
    getModulesList() {
        this.isModulesTableLoading = true;
        timer(0, 5000)
            .pipe(
                takeUntil(this.unsub),
                switchMap(() => this.deploymentsService.getDeployments())
            )
            .subscribe((deploymentsList: Deployment[]) => {
                this.modulesDataset = [];
                this.isModulesTableLoading = false;
                deploymentsList.forEach((deployment: Deployment) => {
                    const row: DeploymentTableRow = {
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
                    this.modulesDataset.push(row);
                });
                this.modulesDataSource =
                    new MatTableDataSource<DeploymentTableRow>(
                        this.modulesDataset
                    );
            });
    }

    removeModule(uuid: string) {
        this.deploymentsService.deleteDeploymentByUUID(uuid).subscribe({
            next: (response: statusReturn) => {
                if (response && response['status'] == 'success') {
                    const itemIndex = this.modulesDataset.findIndex(
                        (obj) => obj['uuid'] === uuid
                    );
                    this.modulesDataset.splice(itemIndex, 1);
                    this.modulesDataSource =
                        new MatTableDataSource<DeploymentTableRow>(
                            this.modulesDataset
                        );
                    this.snackbarService.openSuccess(
                        'Successfully deleted deployment with uuid: ' + uuid
                    );
                } else {
                    this.snackbarService.openError(
                        'Error deleting deployment with uuid: ' + uuid
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

    /**     TOOLS METHODS     **/
    getToolsList() {
        this.isToolsTableLoading = true;

        timer(0, 5000)
            .pipe(
                takeUntil(this.unsub),
                switchMap(() => this.deploymentsService.getTools())
            )
            .subscribe((tools) => {
                this.toolsDataset = [];
                this.isToolsTableLoading = false;
                tools.forEach((tool: Deployment) => {
                    const row: DeploymentTableRow = {
                        uuid: tool.job_ID,
                        name: tool.title,
                        status: tool.status,
                        containerName: tool.docker_image,
                        gpus: '-',
                        creationTime: tool.submit_time,
                        endpoints: tool.endpoints,
                        mainEndpoint: tool.main_endpoint,
                    };
                    if (tool.error_msg) {
                        row.error_msg = tool.error_msg;
                    }
                    if (
                        tool.resources &&
                        Object.keys(tool.resources).length !== 0
                    ) {
                        row.gpus = tool.resources.gpu_num;
                    }
                    this.toolsDataset.push(row);
                });
                this.toolsDataSource =
                    new MatTableDataSource<DeploymentTableRow>(
                        this.toolsDataset
                    );
            });
    }

    removeTool(uuid: string) {
        this.deploymentsService.deleteToolByUUID(uuid).subscribe({
            next: (response: statusReturn) => {
                if (response && response['status'] == 'success') {
                    const itemIndex = this.toolsDataset.findIndex(
                        (obj) => obj['uuid'] === uuid
                    );
                    this.toolsDataset.splice(itemIndex, 1);
                    this.toolsDataSource =
                        new MatTableDataSource<DeploymentTableRow>(
                            this.toolsDataset
                        );
                    this.snackbarService.openSuccess(
                        'Successfully deleted tool with uuid: ' + uuid
                    );
                } else {
                    this.snackbarService.openError(
                        'Error deleting tool with uuid: ' + uuid
                    );
                }
            },
            error: () => {
                this.snackbarService.openError(
                    'Error deleting tool with uuid: ' + uuid
                );
            },
        });
    }

    /**     SNAPSHOTS METHODS     **/
    getSnapshotsList() {
        this.isSnapshotsTableLoading = true;

        timer(0, 5000)
            .pipe(
                takeUntil(this.unsub),
                switchMap(() => this.snapshotService.getSnapshots())
            )
            .subscribe((snapshots) => {
                this.snapshotsDataset = [];
                this.isSnapshotsTableLoading = false;
                snapshots.forEach((snapshot: Snapshot) => {
                    const row: DeploymentTableRow = {
                        uuid: snapshot.snapshot_ID,
                        name: snapshot.title,
                        status: snapshot.status,
                        containerName: snapshot.docker_image,
                        creationTime: snapshot.submit_time,
                    };

                    this.snapshotsDataset.push(row);
                });
                this.snapshotsDataSource =
                    new MatTableDataSource<DeploymentTableRow>(
                        this.snapshotsDataset
                    );
            });
    }

    createSnapshot(row: DeploymentTableRow) {
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

    removeSnapshot(uuid: string) {
        this.snapshotService.deleteSnapshotByUUID(uuid).subscribe({
            next: (response: StatusReturnSnapshot) => {
                if (response && response['status'] == 'success') {
                    const itemIndex = this.snapshotsDataset.findIndex(
                        (obj) => obj['uuid'] === uuid
                    );
                    this.snapshotsDataset.splice(itemIndex, 1);
                    this.snapshotsDataSource =
                        new MatTableDataSource<DeploymentTableRow>(
                            this.snapshotsDataset
                        );
                    this.snackbarService.openSuccess(
                        'Successfully deleted snapshot with uuid: ' + uuid
                    );
                } else {
                    this.snackbarService.openError(
                        'Error deleting snapshot with uuid: ' + uuid
                    );
                }
            },
            error: () => {
                this.snackbarService.openError(
                    'Error deleting snapshot with uuid: ' + uuid
                );
            },
        });
    }

    /**     SHARED METHODS     **/
    openDeploymentDetailDialog(uuid: string, isTool: boolean): void {
        const width = this.mobileQuery.matches ? '300px' : '650px';
        this.dialog.open(DeploymentDetailComponent, {
            data: { uuid: uuid, isTool: isTool },
            width: width,
            maxWidth: width,
            minWidth: width,
            autoFocus: false,
            restoreFocus: false,
        });
    }

    ngOnDestroy(): void {
        this.unsub.next();
        this.unsub.complete();
    }
}
