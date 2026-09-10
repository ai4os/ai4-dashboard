import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeploymentsService } from '../../services/deployments-service/deployments.service';
import { DeploymentDetailComponent } from '../deployment-detail/deployment-detail.component';
import {
    Deployment,
    DeploymentTableRow,
    Snapshot,
    StatusReturn,
} from '@app/shared/interfaces/deployment.interface';
import { Subject, switchMap, takeUntil, timer } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import {
    SnapshotService,
    StatusReturnSnapshot,
} from '../../services/snapshots-service/snapshot.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { PlatformStatusService } from '@app/shared/services/platform-status/platform-status.service';
import {
    PlatformStatus,
    StatusNotification,
} from '@app/shared/interfaces/platform-status.interface';
import * as yaml from 'js-yaml';
import { formatDate } from '@app/shared/utils/formatDate';
import { DeploymentsTableComponent } from '../../../../shared/components/deployments-table/deployments-table.component';

import { UiTableColumn } from '@app/shared/components/ui/ui-table/ui-table.component';
import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';

@Component({
    selector: 'app-deployments-list',
    templateUrl: './deployments-list.component.html',
    styleUrls: ['./deployments-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [DeploymentsTableComponent, TranslatePipe, UiBannerComponent],
})
export class DeploymentsListComponent implements OnInit, OnDestroy {
    deploymentsService = inject(DeploymentsService);
    dialog = inject(MatDialog);
    translateService = inject(TranslateService);
    snackbarService = inject(SnackbarService);
    snapshotService = inject(SnapshotService);
    changeDetectorRef = inject(ChangeDetectorRef);
    media = inject(MediaMatcher);
    platformStatusService = inject(PlatformStatusService);

    constructor() {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () =>
            this.changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    snapshotColumns: UiTableColumn<DeploymentTableRow>[] = [
        {
            key: 'name',
            label: 'DEPLOYMENTS.DEPLOYMENT-NAME',
            sticky: true,
            sortable: true,
            width: '260px',
        },
        {
            key: 'status',
            label: 'DEPLOYMENTS.STATUS',
            align: 'center',
            sortable: true,
            width: '150px',
        },
        {
            key: 'tagName',
            label: 'DEPLOYMENTS.TAG-NAME',
            minWidth: '260px',
        },
        {
            key: 'size',
            label: 'DEPLOYMENTS.SIZE',
            align: 'center',
            width: '120px',
        },
        {
            key: 'creationTime',
            label: 'DEPLOYMENTS.CREATION-TIME',
            align: 'center',
            sortable: true,
            width: '200px',
        },
        {
            key: 'actions',
            label: 'DEPLOYMENTS.ACTIONS',
            align: 'right',
            width: 'auto',
        },
    ];

    isModulesTableLoading = false;
    isToolsTableLoading = false;
    isSnapshotsTableLoading = false;

    notificationsUpdated = false;
    notifications: StatusNotification[] = [];
    displayedNotifications: StatusNotification[] = [];

    modulesDataset: DeploymentTableRow[] = [];
    toolsDataset: DeploymentTableRow[] = [];
    snapshotsDataset: DeploymentTableRow[] = [];

    mobileQuery: MediaQueryList;
    private readonly _mobileQueryListener: () => void;
    private readonly unsub = new Subject<void>();

    ngOnInit(): void {
        this.modulesDataset = [];
        this.toolsDataset = [];
        this.snapshotsDataset = [];

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
                const updatedModulesDataset: DeploymentTableRow[] = [];
                this.isModulesTableLoading = false;
                deploymentsList.forEach((deployment: Deployment) => {
                    const containerName = deployment.docker_image.includes(
                        'user-snapshots'
                    )
                        ? this.translateService.instant(
                              'CATALOG.CONF-FORMS.DEPLOYED-FROM-SNAPSHOT-ID'
                          ) + deployment.docker_image.split(':')[1]
                        : deployment.docker_image;
                    const row: DeploymentTableRow = {
                        uuid: deployment.job_ID,
                        name: deployment.title,
                        status: deployment.status,
                        containerName: containerName,
                        gpus: '-',
                        creationTime: formatDate(deployment.submit_time),
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
                    this.modulesDataset = [...this.modulesDataset];

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
                const updatedToolsDataset: DeploymentTableRow[] = [];
                this.isToolsTableLoading = false;
                tools.forEach((tool: Deployment) => {
                    const row: DeploymentTableRow = {
                        uuid: tool.job_ID,
                        name: tool.title,
                        status: tool.status,
                        containerName: tool.docker_image,
                        gpus: '-',
                        creationTime: formatDate(tool.submit_time),
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
                    this.toolsDataset = [...this.toolsDataset];

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
                const updatedSnapshotsDataset: DeploymentTableRow[] = [];
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
                        creationTime: formatDate(snapshot.submit_time),
                        snapshot_ID: snapshot.snapshot_ID,
                    };
                    if (snapshot.error_msg) {
                        row.error_msg = snapshot.error_msg;
                    }
                    updatedSnapshotsDataset.push(row);
                });
                this.snapshotsDataset = updatedSnapshotsDataset;
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
                    this.snapshotsDataset = [...this.snapshotsDataset];

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
    openDeploymentDetailDialog(uuid: string, type: string): void {
        const width = this.mobileQuery.matches ? '300px' : '650px';
        this.dialog.open(DeploymentDetailComponent, {
            data: { uuid: uuid, type: type },
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
