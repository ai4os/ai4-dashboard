import { MediaMatcher } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OscarInferenceService } from '../../services/oscar-inference.service';
import { OscarService } from '@app/shared/interfaces/oscar-service.interface';
import { InferenceDetailComponent } from '../inference-detail/inference-detail.component';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { DeploymentTableRow } from '@app/shared/interfaces/deployment.interface';
import { timer, takeUntil, switchMap, Subject } from 'rxjs';
import { formatDate } from '@app/shared/utils/formatDate';
import { TranslatePipe } from '@ngx-translate/core';
import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';
import { UiTableColumn } from '@app/shared/components/ui/ui-table/ui-table.component';
import { DeploymentsTableComponent } from '../../../../shared/components/deployments-table/deployments-table.component';

@Component({
    selector: 'app-inferences-list',
    templateUrl: './inferences-list.component.html',
    styleUrl: './inferences-list.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TranslatePipe, UiBannerComponent, DeploymentsTableComponent],
})
export class InferencesListComponent implements OnInit {
    dialog = inject(MatDialog);
    changeDetectorRef = inject(ChangeDetectorRef);
    media = inject(MediaMatcher);
    oscarInferenceService = inject(OscarInferenceService);
    confirmationDialog = inject(MatDialog);
    snackbarService = inject(SnackbarService);

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
            width: '260px',
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
    private _mobileQueryListener: () => void;
    private unsub = new Subject<void>();

    ngOnInit(): void {
        this.dataset = [];
        this.getServicesList();
    }

    getServicesList() {
        this.isLoading = true;
        timer(0, 5000)
            .pipe(
                takeUntil(this.unsub),
                switchMap(() => this.oscarInferenceService.getServices())
            )
            .subscribe({
                next: (servicesList: OscarService[]) => {
                    this.dataset = servicesList.map((service: OscarService) => {
                        return {
                            uuid: service.name,
                            name: service.environment.variables.PAPI_TITLE,
                            containerName: service.image,
                            creationTime: formatDate(
                                service.environment.variables.PAPI_CREATED
                            ),
                        };
                    });
                    this.isLoading = false;
                },
                error: () => {
                    this.dataset = [];
                    this.isLoading = false;
                },
            });
    }

    removeService(uuid: string) {
        this.oscarInferenceService.deleteServiceByName(uuid).subscribe({
            next: (serviceName: string) => {
                if (serviceName && serviceName == uuid) {
                    const itemIndex = this.dataset.findIndex(
                        (obj) => obj['uuid'] === uuid
                    );
                    this.dataset.splice(itemIndex, 1);
                    this.dataset = [...this.dataset];
                    this.isLoading = false;
                    this.snackbarService.openSuccess(
                        'Successfully deleted service with uuid: ' + uuid
                    );
                } else {
                    this.isLoading = false;
                    this.snackbarService.openError(
                        'Error deleting service with uuid: ' + uuid
                    );
                }
            },
            error: () => {
                this.isLoading = false;
                this.snackbarService.openError(
                    'Error deleting service with uuid: ' + uuid
                );
            },
        });
    }

    openServiceDetailDialog(uuid: string): void {
        const width = this.mobileQuery.matches ? '300px' : '650px';
        this.dialog.open(InferenceDetailComponent, {
            data: { name: uuid },
            width: width,
            maxWidth: width,
            minWidth: width,
            autoFocus: false,
            restoreFocus: false,
        });
    }
}
