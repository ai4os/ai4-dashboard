import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';
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
import { Router } from '@angular/router';
import { SnapshotDetailComponent } from '@app/modules/deployments/components/snapshot-detail/snapshot-detail.component';
import { StatusNotification } from '@app/shared/interfaces/platform-status.interface';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
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
        MatTooltip,
        MatBadge,
        TranslatePipe,
    ],
})
export class DeploymentsTableComponent implements OnInit {
    dialog = inject(MatDialog);
    private snackbarService = inject(SnackbarService);
    private snapshotService = inject(SnapshotService);
    translateService = inject(TranslateService);
    confirmationDialog = inject(MatDialog);
    private media = inject(MediaMatcher);
    private router = inject(Router);
    private changeDetectorRef = inject(ChangeDetectorRef);

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

    @Output() showElementInfo = new EventEmitter<string>();
    @Output() deleteElement = new EventEmitter<string>();

    @Input() columns: UiTableColumn<DeploymentTableRow>[] = [
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
        // No `width`: grows to fill the leftover row space, same as the old
        // `.mat-column-containerName` which only set a min-width.
        {
            key: 'containerName',
            label: 'DEPLOYMENTS.CONTAINER-NAME',
            minWidth: '260px',
        },
        {
            key: 'gpus',
            label: 'DEPLOYMENTS.GPUS',
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
        // 'auto': sized to whatever icons actually render (count varies by
        // deploymentType), and ends up flush against the right edge because
        // containerName grows into all the space before it.
        {
            key: 'actions',
            label: 'DEPLOYMENTS.ACTIONS',
            align: 'center',

            width: 'auto',
        },
    ];

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    private sortState: UiTableSortEvent<DeploymentTableRow> | null = null;

    ngOnInit(): void {}

    /** Dataset sorted according to the ui-table header the user last clicked. */
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

    openDeploymentDetailDialog(row: DeploymentTableRow): void {
        if (this.deploymentType === 'snapshot') {
            this.openSnapshotDetailDialog({
                snapshot_ID: row.snapshot_ID!,
                title: row.name,
                status: row.status!,
                submit_time: formatDate(row.creationTime),
                docker_image: '',
                size: +row.size!,
                nomad_ID: '',
                description: row.description,
                error_msg: row.error_msg,
            });
        } else {
            this.showElementInfo.emit(row.uuid);
        }
    }

    removeDeployment(e: MouseEvent, row: DeploymentTableRow) {
        e.stopPropagation();
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: {
                    title:
                        'Are you sure you want to delete this ' +
                        this.deploymentType +
                        '?',
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

    openSnapshotDetailDialog(snapshot: Snapshot): void {
        const width = this.mobileQuery.matches ? '300px' : '650px';
        this.dialog.open(SnapshotDetailComponent, {
            data: { snapshot },
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

    /**
     * Semantic color for the status ui-chip. Reuses the existing shields.io
     * badge logic so the underlying business rules for each status don't
     * have to be re-implemented here, and just remaps the resulting badge
     * color name to one of ui-chip's semantic colors.
     */
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
                    title: `Are you sure you want to create a snapshot of this deployment?`,
                    subtitlePrefix:
                        'PROFILE.SERVICES-TAB.DIALOG.SUBTITLE-PREFIX',
                    optionA: 'GENERAL.CANCEL',
                    optionB: 'PROFILE.SERVICES-TAB.DIALOG.UNLINK',
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
                    title: 'How do you want to redeploy this snapshot?',
                    optionA: 'Regular deployment',
                    optionB: 'Batch deployment',
                },
            })
            .afterClosed()
            .subscribe((action: string) => {
                sessionStorage.setItem('deploymentType', this.deploymentType);
                sessionStorage.setItem('deploymentRow', JSON.stringify(row));
                if (action === 'Regular deployment') {
                    this.router.navigate(['/catalog/modules/snapshots/deploy']);
                } else if (action === 'Batch deployment') {
                    this.router.navigate(['/catalog/modules/snapshots/batch']);
                }
            });
    }

    openBatchDocumentation(): void {
        window.open(
            'https://docs.ai4os.eu/en/latest/howtos/train/batch.html',
            '_blank'
        );
    }
}
