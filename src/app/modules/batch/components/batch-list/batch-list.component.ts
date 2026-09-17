import { MediaMatcher } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    ChangeDetectionStrategy,
    OnInit,
    inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
    DeploymentTableRow,
    Deployment,
    StatusReturn,
} from '@app/shared/interfaces/deployment.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { Subject, timer, takeUntil, switchMap } from 'rxjs';
import { BatchService } from '../../services/batch.service';
import { DeploymentDetailComponent } from '@app/modules/deployments/components/deployment-detail/deployment-detail.component';
import { formatDate } from '@app/shared/utils/formatDate';
import { DeploymentsTableComponent } from '../../../../shared/components/deployments-table/deployments-table.component';
import { TranslatePipe } from '@ngx-translate/core';
import { UiTableColumn } from '@app/shared/components/ui/ui-table/ui-table.component';
import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-batch-list',
    templateUrl: './batch-list.component.html',
    styleUrl: './batch-list.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [DeploymentsTableComponent, TranslatePipe, UiBannerComponent],
})
export class BatchListComponent implements OnInit {
    dialog = inject(MatDialog);
    router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    confirmationDialog = inject(MatDialog);
    snackbarService = inject(SnackbarService);
    batchService = inject(BatchService);
    media = inject(MediaMatcher);
    changeDetectorRef = inject(ChangeDetectorRef);

    constructor() {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () =>
            this.changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    columns: UiTableColumn<DeploymentTableRow>[] = [
        {
            key: 'name',
            label: 'DEPLOYMENTS.DEPLOYMENT-NAME',
            sticky: true,
            sortable: true,
            width: '200px',
        },
        {
            key: 'status',
            label: 'DEPLOYMENTS.STATUS',
            align: 'center',
            sortable: true,
            width: '110px',
        },
        {
            key: 'containerName',
            label: 'DEPLOYMENTS.CONTAINER-NAME',
            minWidth: '240px',
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

    readonly batchDetailRouteBase = '/tasks/batch';

    dataset: DeploymentTableRow[] = [];

    isLoading = false;
    mobileQuery: MediaQueryList;
    private readonly _mobileQueryListener: () => void;
    private readonly unsub = new Subject<void>();

    ngOnInit(): void {
        this.dataset = [];
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
                    this.dataset = deploymentsList.map(
                        (deployment: Deployment): DeploymentTableRow => {
                            const row: DeploymentTableRow = {
                                uuid: deployment.job_ID,
                                name: deployment.title,
                                status: deployment.status,
                                containerName: deployment.docker_image,
                                gpus: '-',
                                creationTime: formatDate(
                                    deployment.submit_time
                                ),
                                endpoints: deployment.endpoints,
                                mainEndpoint: deployment.main_endpoint,
                                datacenter: deployment.datacenter,
                                energy: deployment.energy
                                    ? {
                                          power_w: (deployment.energy as any)
                                              .power_w,
                                          energy_wh: (deployment.energy as any)
                                              .energy_wh,
                                          carbon_g: (deployment.energy as any)
                                              .carbon_g,
                                          water_l: (deployment.energy as any)
                                              .water_l,
                                      }
                                    : null,
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

                            return row;
                        }
                    );

                    this.isLoading = false;
                },
                error: () => {
                    this.dataset = [];
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

                    this.dataset = [...this.dataset];

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

    openDeploymentDetail(uuid: string): void {
        this.router.navigate([uuid], { relativeTo: this.route });
    }
}
