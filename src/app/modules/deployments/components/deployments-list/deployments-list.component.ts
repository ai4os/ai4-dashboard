import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DeploymentsService } from '../../services/deployments-service/deployments.service';
import { DeploymentDetailComponent } from '../deployment-detail/deployment-detail.component';
import {
    Deployment,
    DeploymentTableRow,
    Snapshot,
    TableColumn,
    StatusReturn,
} from '@app/shared/interfaces/deployment.interface';
import { Subject, switchMap, takeUntil, timer } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import {
    SnapshotService,
    StatusReturnSnapshot,
} from '../../services/snapshots-service/snapshot.service';
import { TranslateService } from '@ngx-translate/core';
import { PlatformStatusService } from '@app/shared/services/platform-status/platform-status.service';
import {
    PlatformStatus,
    StatusNotification,
} from '@app/shared/interfaces/platform-status.interface';
import * as yaml from 'js-yaml';

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
        public translateService: TranslateService,
        private platformStatusService: PlatformStatusService,
        private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    snapshotColumns: Array<TableColumn> = [
        { columnDef: 'uuid', header: '', hidden: true },
        { columnDef: 'name', header: 'DEPLOYMENTS.DEPLOYMENT-NAME' },
        { columnDef: 'status', header: 'DEPLOYMENTS.STATUS' },
        {
            columnDef: 'containerName',
            header: 'DEPLOYMENTS.CONTAINER-NAME',
            hidden: true,
        },
        {
            columnDef: 'tagName',
            header: 'DEPLOYMENTS.TAG-NAME',
        },
        { columnDef: 'size', header: 'DEPLOYMENTS.SIZE' },
        { columnDef: 'creationTime', header: 'DEPLOYMENTS.CREATION-TIME' },
        { columnDef: 'endpoints', header: '', hidden: true },
        { columnDef: 'snapshot_ID', header: '', hidden: true },
        { columnDef: 'actions', header: 'DEPLOYMENTS.ACTIONS' },
    ];

    isModulesTableLoading = false;
    isToolsTableLoading = false;
    isSnapshotsTableLoading = false;

    notificationsUpdated = false;
    notifications: StatusNotification[] = [];
    displayedNotifications: StatusNotification[] = [];

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

    /**     NOTIFICATIONS     **/
    checkAndUpdateNotifications() {
        if (
            !this.notificationsUpdated &&
            !this.isModulesTableLoading &&
            !this.isToolsTableLoading
        ) {
            this.platformStatusService
                .getNomadClusterNotifications()
                .subscribe({
                    next: (filteredPlatformStatus: PlatformStatus[]) => {
                        if (filteredPlatformStatus.length > 0) {
                            filteredPlatformStatus.forEach((status) => {
                                if (status.body != null) {
                                    const yamlBody = status.body
                                        .replace(/```yaml/g, '')
                                        .replace(/```[\s\S]*/, '');
                                    const notification: StatusNotification =
                                        yaml.load(
                                            yamlBody
                                        ) as StatusNotification;
                                    this.notifications.push(notification);
                                }
                            });
                            this.displayedNotifications =
                                this.platformStatusService.filterByDateAndVo(
                                    this.notifications
                                );
                        } else {
                            this.notifications = [];
                            this.displayedNotifications = [];
                        }
                        this.notificationsUpdated = true;
                    },
                    error: () => {
                        this.notifications = [];
                        this.displayedNotifications = [];
                        this.snackbarService.openError(
                            'Error retrieving the platform notifications'
                        );
                    },
                });
        }
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
                let updatedModulesDataset: Array<DeploymentTableRow> = [];
                this.isModulesTableLoading = false;
                deploymentsList.forEach((deployment: Deployment) => {
                    const containerName = deployment.docker_image.includes(
                        'user-snapshots'
                    )
                        ? this.translateService.instant(
                              'MODULES.MODULE-TRAIN.GENERAL-CONF-FORM.SNAPSHOT-ID'
                          ) + deployment.docker_image.split(':')[1]
                        : deployment.docker_image;
                    const row: DeploymentTableRow = {
                        uuid: deployment.job_ID,
                        name: deployment.title,
                        status: deployment.status,
                        containerName: containerName,
                        gpus: '-',
                        creationTime: deployment.submit_time,
                        endpoints: deployment.endpoints,
                        mainEndpoint: deployment.main_endpoint,
                        datacenter: deployment.datacenter,
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
                    updatedModulesDataset.push(row);
                });
                if (
                    JSON.stringify(this.modulesDataset) !==
                    JSON.stringify(updatedModulesDataset)
                ) {
                    this.modulesDataset = updatedModulesDataset;
                    this.modulesDataSource =
                        new MatTableDataSource<DeploymentTableRow>(
                            this.modulesDataset
                        );
                }
                this.checkAndUpdateNotifications();
            });
    }

    removeModule(uuid: string) {
        this.deploymentsService.deleteDeploymentByUUID(uuid).subscribe({
            next: (response: StatusReturn) => {
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
                let updatedToolsDataset: Array<DeploymentTableRow> = [];
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
                        datacenter: tool.datacenter,
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
                    updatedToolsDataset.push(row);
                });
                if (
                    JSON.stringify(this.toolsDataset) !==
                    JSON.stringify(updatedToolsDataset)
                ) {
                    this.toolsDataset = updatedToolsDataset;
                    this.toolsDataSource =
                        new MatTableDataSource<DeploymentTableRow>(
                            this.toolsDataset
                        );
                }
                this.checkAndUpdateNotifications();
            });
    }

    removeTool(uuid: string) {
        this.deploymentsService.deleteToolByUUID(uuid).subscribe({
            next: (response: StatusReturn) => {
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
                    const size = Math.trunc(snapshot.size) / Math.pow(1024, 3);
                    const row: DeploymentTableRow = {
                        uuid: snapshot.snapshot_ID,
                        name: snapshot.title,
                        description: snapshot.description,
                        status: snapshot.status,
                        containerName: snapshot.docker_image,
                        tagName: snapshot.snapshot_ID,
                        size: size.toFixed(2),
                        creationTime: snapshot.submit_time,
                        snapshot_ID: snapshot.snapshot_ID,
                    };
                    if (snapshot.error_msg) {
                        row.error_msg = snapshot.error_msg;
                    }
                    this.snapshotsDataset.push(row);
                });
                this.snapshotsDataSource =
                    new MatTableDataSource<DeploymentTableRow>(
                        this.snapshotsDataset
                    );
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
