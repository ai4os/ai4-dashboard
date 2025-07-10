import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
    TableColumn,
    DeploymentTableRow,
    Deployment,
    StatusReturn,
} from '@app/shared/interfaces/deployment.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { Subject, timer, takeUntil, switchMap } from 'rxjs';
import { BatchService } from '../../services/batch.service';
import { DeploymentDetailComponent } from '@app/modules/deployments/components/deployment-detail/deployment-detail.component';

@Component({
    selector: 'app-batch-list',
    templateUrl: './batch-list.component.html',
    styleUrl: './batch-list.component.scss',
})
export class BatchListComponent {
    constructor(
        public dialog: MatDialog,
        public confirmationDialog: MatDialog,
        private snackbarService: SnackbarService,
        private batchService: BatchService,
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
        { columnDef: 'creationTime', header: 'DEPLOYMENTS.CREATION-TIME' },
        { columnDef: 'actions', header: 'DEPLOYMENTS.ACTIONS' },
    ];
    dataset: Array<DeploymentTableRow> = [];
    dataSource!: MatTableDataSource<DeploymentTableRow>;

    isLoading = false;
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    private unsub = new Subject<void>();

    ngOnInit(): void {
        this.dataset = [];
        this.dataSource = new MatTableDataSource<DeploymentTableRow>(
            this.dataset
        );
        this.getServicesList();
    }

    getServicesList() {
        this.isLoading = true;
        timer(0, 5000)
            .pipe(
                takeUntil(this.unsub),
                switchMap(() => this.batchService.getBatchDeployments())
            )
            .subscribe({
                next: (deploymentsList: Deployment[]) => {
                    this.dataset = [];
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

    removeBatchDeployment(uuid: string) {
        this.batchService.deleteBatchDeploymentByUUID(uuid).subscribe({
            next: (response: StatusReturn) => {
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
                        'Successfully deleted batch deployment with uuid: ' +
                            uuid
                    );
                } else {
                    this.snackbarService.openError(
                        'Error deleting batch deployment with uuid: ' + uuid
                    );
                }
            },
            error: () => {
                this.snackbarService.openError(
                    'Error deleting batch deployment with uuid: ' + uuid
                );
            },
        });
    }

    openDeploymentDetailDialog(uuid: string): void {
        const width = this.mobileQuery.matches ? '300px' : '650px';
        this.dialog.open(DeploymentDetailComponent, {
            data: { uuid: uuid, type: 'batch' },
            width: width,
            maxWidth: width,
            minWidth: width,
            autoFocus: false,
            restoreFocus: false,
        });
    }
}
