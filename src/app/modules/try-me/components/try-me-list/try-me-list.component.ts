import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { TryMeService } from '../../services/try-me.service';
import { GradioDeployment } from '@app/shared/interfaces/module.interface';
import {
    DeploymentTableRow,
    statusReturn,
    TableColumn,
} from '@app/shared/interfaces/deployment.interface';
import { TryMeDetailComponent } from '../try-me-detail/try-me-detail.component';
import { Subject, switchMap, takeUntil, timer } from 'rxjs';

@Component({
    selector: 'app-try-me-list',
    templateUrl: './try-me-list.component.html',
    styleUrls: ['./try-me-list.component.scss'],
})
export class TryMeListComponent implements OnInit {
    constructor(
        public tryMeService: TryMeService,
        public dialog: MatDialog,
        public confirmationDialog: MatDialog,
        private snackbarService: SnackbarService,
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
        { columnDef: 'endpoints', header: '', hidden: true },
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
        this.getTryMeDeploymentsList();
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
                            name: deployment.title,
                            status: deployment.status,
                            containerName: deployment.docker_image,
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

    removeTryMe(uuid: string) {
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

    openTryMeDetailDialog(uuid: string): void {
        const width = this.mobileQuery.matches ? '300px' : '650px';
        this.dialog.open(TryMeDetailComponent, {
            data: { uuid: uuid },
            width: width,
            maxWidth: width,
            minWidth: width,
            autoFocus: false,
            restoreFocus: false,
        });
    }
}
