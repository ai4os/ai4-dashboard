import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MatBadge } from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import {
    ConfirmationDialogComponent,
    ConfirmationDialogData,
} from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import {
    DeploymentTableRow,
    Snapshot,
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
import { Router, RouterLink } from '@angular/router';
import { SnapshotDetailComponent } from '@app/modules/deployments/components/snapshot-detail/snapshot-detail.component';
import { StatusNotification } from '@app/shared/interfaces/platform-status.interface';
import {
    TranslateService,
    TranslatePipe,
    TranslateDirective,
} from '@ngx-translate/core';
import { MultipleActionsDialogComponent } from '../multiple-actions-dialog/multiple-actions-dialog.component';
import { formatDate } from '@app/shared/utils/formatDate';
import { UiTableCellDirective } from '@app/shared/directives/ui-table-cell.directive';
import { UiButtonComponent } from '../ui/ui-button/ui-button.component';
import { UiCardComponent } from '../ui/ui-card/ui-card.component';
import { ChipVariant, UiChipComponent } from '../ui/ui-chip/ui-chip.component';
import {
    UiTableComponent,
    UiTableColumn,
    UiTableSortEvent,
} from '../ui/ui-table/ui-table.component';

@Component({
    selector: 'app-deployments-table',
    templateUrl: './deployments-table.component.html',
    styleUrl: './deployments-table.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        UiCardComponent,
        UiTableComponent,
        UiTableCellDirective,
        UiButtonComponent,
        UiChipComponent,
        MatIcon,
        MatBadge,
        TranslatePipe,
        RouterLink,
        TranslateDirective,
    ],
})
export class DeploymentsTableComponent {
    dialog = inject(MatDialog);
    private readonly snackbarService = inject(SnackbarService);
    private readonly snapshotService = inject(SnapshotService);
    translateService = inject(TranslateService);
    confirmationDialog = inject(MatDialog);
    private readonly media = inject(MediaMatcher);
    private readonly router = inject(Router);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);

    constructor() {
        const changeDetectorRef = this.changeDetectorRef;

        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    @Input() cardName = '';
    @Input() cardIcon?: string;
    @Input() cardImage?: string;
    @Input() showCardActions = false;
    @Input() deploymentType = 'module';
    @Input() isLoading = false;
    @Input() dataset: DeploymentTableRow[] = [];
    @Input() datacentersNotifications: StatusNotification[] = [];

    @Output() deleteElement = new EventEmitter<string>();

    @Input() columns: UiTableColumn<DeploymentTableRow>[] = [
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
            width: '130px',
        },
        {
            key: 'containerName',
            label: 'DEPLOYMENTS.CONTAINER-NAME',
            minWidth: '230px',
        },
        {
            key: 'gpus',
            label: 'DEPLOYMENTS.GPUS',
            align: 'center',
            width: '120px',
        },
        {
            key: 'power_w',
            label: 'POWER (W)',
            align: 'center',
            sortable: true,
            width: '120px',
        },
        {
            key: 'energy_wh',
            label: 'ENERGY (Wh)',
            align: 'center',
            sortable: true,
            width: '120px',
        },
        {
            key: 'carbon_g',
            label: 'CARBON (g)',
            align: 'center',
            sortable: true,
            width: '120px',
        },
        {
            key: 'water_l',
            label: 'WATER (L)',
            align: 'center',
            sortable: true,
            width: '120px',
        },
        {
            key: 'creationTime',
            label: 'DEPLOYMENTS.CREATION-TIME',
            align: 'center',
            sortable: true,
            width: '190px',
        },
        {
            key: 'actions',
            label: 'DEPLOYMENTS.ACTIONS',
            align: 'right',
            width: 'auto',
        },
    ];

    mobileQuery: MediaQueryList;
    private readonly _mobileQueryListener: () => void;

    private sortState: UiTableSortEvent<DeploymentTableRow> | null = null;

    get sortedDataset(): DeploymentTableRow[] {
        if (!this.sortState?.direction) {
            return this.dataset;
        }

        const { key, direction } = this.sortState;
        return [...this.dataset].sort((a, b) => {
            const valueA = a[key as keyof DeploymentTableRow];
            const valueB = b[key as keyof DeploymentTableRow];

            if (valueA == null) return 1;
            if (valueB == null) return -1;
            if (valueA < valueB) return direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    onSortChange(event: UiTableSortEvent<DeploymentTableRow>): void {
        this.sortState = event;
    }

    trackByUuid = (_: number, row: DeploymentTableRow) => row.uuid;

    goToNewDevEnv(): void {
        this.router.navigate(['/catalog/tools/ai4os-dev-env/deploy']);
    }

    @Input() detailRouteBase: string | null = null;

    getDetailLink(row: DeploymentTableRow): string[] | null {
        return this.detailRouteBase ? [this.detailRouteBase, row.uuid] : null;
    }

    formatMetric(val: number | undefined): string {
        if (val == null) return '-';
        if (val === 0) return '0';
        if (val < 0.01) return val.toExponential(2);
        return val.toFixed(2);
    }

    removeDeployment(e: MouseEvent, row: DeploymentTableRow) {
        e.stopPropagation();
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: {
                    title: 'DEPLOYMENTS.DELETE.TITLE',
                    subtitlePrefix: 'DEPLOYMENTS.DELETE.SUBTITLE-PREFIX',
                    subtitleHighlight: row.name,
                    subtitleSuffix: 'DEPLOYMENTS.DELETE.SUBTITLE-SUFFIX',
                    optionA: 'GENERAL.CANCEL',
                    optionB: 'GENERAL.DELETE',
                } as ConfirmationDialogData,
                panelClass: 'ui-dialog-panel',
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
            width,
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

    getMainEndpoint(row: DeploymentTableRow) {
        if (this.deploymentType === 'try-me') {
            return row.endpoints?.ui;
        }
        const mainEndpoint = row.mainEndpoint;
        if (mainEndpoint && row.endpoints?.[mainEndpoint]) {
            return row.endpoints[mainEndpoint];
        }
        return '';
    }

    showQuickAccess(): boolean {
        return (
            this.deploymentType !== 'inference' &&
            this.deploymentType !== 'snapshot' &&
            this.deploymentType !== 'batch'
        );
    }

    showSnapshotAction(row: DeploymentTableRow): boolean {
        return (
            this.deploymentType === 'module' ||
            !!row.containerName?.includes('ai4os-dev-env')
        );
    }

    hasDeploymentErrors(row: DeploymentTableRow) {
        return !!row.error_msg;
    }

    hasDatacenterUnderMaintenance(row: DeploymentTableRow) {
        return !!this.findMaintenanceNotification(row);
    }

    getMaintenanceInfo(row: DeploymentTableRow): string {
        const notification = this.findMaintenanceNotification(row);

        if (!notification) {
            return '';
        }

        return this.translateService.instant(
            'DEPLOYMENTS.DATACENTER-DOWNTIME-NOTIFICATION',
            {
                datacenter: row.datacenter,
                startDate:
                    notification.downtimeStart?.toLocaleDateString('es-ES'),
                endDate: notification.downtimeEnd?.toLocaleDateString('es-ES'),
            }
        );
    }

    private findMaintenanceNotification(row: DeploymentTableRow) {
        return this.datacentersNotifications.find((n) =>
            n.datacenters?.includes(row.datacenter!)
        );
    }

    getStatusChipColor(row: DeploymentTableRow): ChipVariant {
        const badge =
            this.deploymentType === 'snapshot' ||
            this.deploymentType === 'batch'
                ? getSnapshotBadge(row.status!)
                : getDeploymentBadge(row.status!);

        const shieldColor = badge.split('-').pop() ?? '';
        const colorMap: Record<string, ChipVariant> = {
            green: 'success-solid',
            brightgreen: 'success-solid',
            red: 'danger-solid',
            orange: 'warning-solid',
            yellow: 'warning-solid',
            blue: 'primary-solid',
            grey: 'default-solid',
            gray: 'default-solid',
            lightgrey: 'default-solid',
            lightgray: 'default-solid',
        };

        return colorMap[shieldColor] ?? 'neutral';
    }

    createSnapshot(e: Event, row: DeploymentTableRow) {
        e.stopPropagation();
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: {
                    title: `DEPLOYMENTS.SNAPSHOT.TITLE`,
                    subtitlePrefix: 'DEPLOYMENTS.SNAPSHOT.DESC',
                    optionA: 'GENERAL.CANCEL',
                    optionB: 'DEPLOYMENTS.SNAPSHOT.CREATE',
                    icon: 'stylus',
                } as ConfirmationDialogData,
                panelClass: 'ui-dialog-panel',
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (!confirmed) {
                    return;
                }
                this.snapshotService.createSnapshot(row.uuid).subscribe({
                    next: (response: StatusReturnSnapshot) => {
                        if (response?.status === 'success') {
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
            });
    }

    redeploySnapshot(e: Event, row: DeploymentTableRow) {
        e.stopPropagation();

        this.dialog
            .open(MultipleActionsDialogComponent, {
                data: {
                    title: 'DEPLOYMENTS.SNAPSHOT.REDEPLOY.TITLE',
                    subtitle: 'DEPLOYMENTS.SNAPSHOT.REDEPLOY.DESC',
                    optionA: 'DEPLOYMENTS.SNAPSHOT.REDEPLOY.REGULAR',
                    optionB: 'DEPLOYMENTS.SNAPSHOT.REDEPLOY.BATCH',
                    icon: 'deployed_code_update',
                },
                panelClass: 'ui-dialog-panel',
            })
            .afterClosed()
            .subscribe((action: string) => {
                sessionStorage.setItem('deploymentType', this.deploymentType);
                sessionStorage.setItem('deploymentRow', JSON.stringify(row));
                if (action === 'DEPLOYMENTS.SNAPSHOT.REDEPLOY.REGULAR') {
                    this.router.navigate(['/catalog/modules/snapshots/deploy']);
                } else if (action === 'DEPLOYMENTS.SNAPSHOT.REDEPLOY.BATCH') {
                    this.router.navigate(['/catalog/modules/snapshots/batch']);
                }
            });
    }
}
