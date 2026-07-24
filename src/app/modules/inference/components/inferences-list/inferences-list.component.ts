import { MediaMatcher } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OscarInferenceService } from '../../services/oscar-inference.service';
import { OscarService } from '@app/shared/interfaces/oscar-service.interface';
import { InferenceDetailComponent } from '../inference-detail/inference-detail.component';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import {
    TableColumn,
    DeploymentTableRow,
} from '@app/shared/interfaces/deployment.interface';
import { timer, takeUntil, switchMap, Subject } from 'rxjs';
import { formatDate } from '@app/shared/utils/formatDate';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { DeploymentsTableComponent } from '../../../../shared/components/deployments-table/deployments-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-inferences-list',
    templateUrl: './inferences-list.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatToolbar, MatIcon, DeploymentsTableComponent, TranslatePipe],
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

    columns: TableColumn[] = [
        { columnDef: 'uuid', header: '', hidden: true },
        { columnDef: 'name', header: 'DEPLOYMENTS.DEPLOYMENT-NAME' },
        { columnDef: 'containerName', header: 'DEPLOYMENTS.CONTAINER-NAME' },
        { columnDef: 'creationTime', header: 'DEPLOYMENTS.CREATION-TIME' },
        { columnDef: 'actions', header: 'DEPLOYMENTS.ACTIONS' },
    ];
    dataset: DeploymentTableRow[] = [];
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
                switchMap(() => this.oscarInferenceService.getServices())
            )
            .subscribe({
                next: (servicesList: OscarService[]) => {
                    this.dataset = [];
                    servicesList.forEach((service: OscarService) => {
                        service.title =
                            service.environment.variables.PAPI_TITLE;
                        service.submit_time =
                            service.environment.variables.PAPI_CREATED;
                        const row: DeploymentTableRow = {
                            uuid: service.name,
                            name: service.title,
                            containerName: service.image,
                            creationTime: formatDate(service.submit_time),
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

    removeService(uuid: string) {
        this.oscarInferenceService.deleteServiceByName(uuid).subscribe({
            next: (serviceName: string) => {
                if (serviceName && serviceName == uuid) {
                    const itemIndex = this.dataset.findIndex(
                        (obj) => obj['uuid'] === uuid
                    );
                    this.dataset.splice(itemIndex, 1);
                    this.dataSource =
                        new MatTableDataSource<DeploymentTableRow>(
                            this.dataset
                        );
                    this.isLoading = false;
                    this.snackbarService.openSuccess(
                        'Successfully deleted service with uuid: ' + uuid
                    );
                } else {
                    this.dataSource =
                        new MatTableDataSource<DeploymentTableRow>(
                            this.dataset
                        );
                    this.isLoading = false;
                    this.snackbarService.openError(
                        'Error deleting service with uuid: ' + uuid
                    );
                }
            },
            error: () => {
                this.dataSource = new MatTableDataSource<DeploymentTableRow>(
                    this.dataset
                );
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
