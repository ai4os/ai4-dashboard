import { MediaMatcher } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { TryMeService } from '../../services/try-me.service';
import { GradioDeployment } from '@app/shared/interfaces/module.interface';
import {
    DeploymentTableRow,
    StatusReturn,
} from '@app/shared/interfaces/deployment.interface';
import { TryMeDetailComponent } from '../try-me-detail/try-me-detail.component';
import { Subject, switchMap, takeUntil, timer } from 'rxjs';
import { formatDate } from '@app/shared/utils/formatDate';

import { DeploymentsTableComponent } from '../../../../shared/components/deployments-table/deployments-table.component';

import { TranslatePipe } from '@ngx-translate/core';
import { UiTableColumn } from '@app/shared/components/ui/ui-table/ui-table.component';
import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';

@Component({
    selector: 'app-try-me-list',
    templateUrl: './try-me-list.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [DeploymentsTableComponent, TranslatePipe, UiBannerComponent],
})
export class TryMeListComponent implements OnInit {
    tryMeService = inject(TryMeService);
    dialog = inject(MatDialog);
    confirmationDialog = inject(MatDialog);
    private readonly snackbarService = inject(SnackbarService);
    private readonly media = inject(MediaMatcher);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    constructor() {
        const changeDetectorRef = this.changeDetectorRef;

        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    columns: UiTableColumn<DeploymentTableRow>[] = [
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
            key: 'containerName',
            label: 'DEPLOYMENTS.CONTAINER-NAME',
            minWidth: '260px',
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
            width: 'auto',
            align: 'right',
        },
    ];

    dataset: DeploymentTableRow[] = [];

    isLoading = false;
    mobileQuery: MediaQueryList;

    private readonly _mobileQueryListener: () => void;
    private readonly unsub = new Subject<void>();

    ngOnInit(): void {
        this.dataset = [];
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
                    this.dataset = deploymentsList.map(
                        (deployment: GradioDeployment): DeploymentTableRow => ({
                            uuid: deployment.job_ID,
                            name: deployment.title,
                            status: deployment.status,
                            containerName: deployment.docker_image,
                            creationTime: formatDate(deployment.submit_time),
                            endpoints: deployment.endpoints,
                        })
                    );
                    this.isLoading = false;
                },
                error: () => {
                    this.dataset = [];
                    this.isLoading = false;
                },
            });
    }

    removeTryMe(uuid: string) {
        this.tryMeService.deleteDeploymentByUUID(uuid).subscribe({
            next: (response: StatusReturn) => {
                if (response && response['status'] == 'success') {
                    const itemIndex = this.dataset.findIndex(
                        (obj) => obj['uuid'] === uuid
                    );
                    this.dataset.splice(itemIndex, 1);
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
