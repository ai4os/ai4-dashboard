import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DeploymentsService } from '@app/modules/deployments/services/deployments.service';
import { getDeploymentBadge } from '@app/modules/deployments/utils/deployment-badge';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import {
    statusReturn,
    Deployment,
} from '@app/shared/interfaces/deployment.interface';
import { Subject, timer, takeUntil, switchMap } from 'rxjs';
import { DeploymentDetailComponent } from '../../deployment-detail/deployment-detail.component';
import { MediaMatcher } from '@angular/cdk/layout';

export interface TableColumn {
    columnDef: string;
    header: string;
    hidden?: boolean;
}

interface toolTableRow {
    uuid: string;
    name: string;
    status: string;
    containerName: string;
    gpus: string | number;
    creationTime: string;
    endpoints?: { [index: string]: string } | undefined;
    mainEndpoint: string;
    error_msg?: string;
}

@Component({
    selector: 'app-tools-table',
    templateUrl: './tools-table.component.html',
    styleUrls: ['./tools-table.component.scss'],
})
export class ToolsTableComponent implements OnInit, OnDestroy {
    constructor(
        public dialog: MatDialog,
        private deploymentsService: DeploymentsService,
        public confirmationDialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _liveAnnouncer: LiveAnnouncer,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    @ViewChild(MatSort) set matSort(sort: MatSort) {
        this.dataSource.sort = sort;
    }
    isLoading = false;

    columns: Array<TableColumn> = [
        { columnDef: 'uuid', header: '', hidden: true },
        { columnDef: 'name', header: 'DEPLOYMENTS.DEPLOYMENT-NAME' },
        { columnDef: 'status', header: 'DEPLOYMENTS.STATUS' },
        { columnDef: 'containerName', header: 'DEPLOYMENTS.CONTAINER-NAME' },
        { columnDef: 'gpus', header: 'DEPLOYMENTS.GPUS' },
        { columnDef: 'creationTime', header: 'DEPLOYMENTS.CREATION-TIME' },
        { columnDef: 'endpoints', header: '', hidden: true },
        { columnDef: 'actions', header: 'DEPLOYMENTS.ACTIONS' },
    ];
    dataset: Array<toolTableRow> = [];

    dataSource!: MatTableDataSource<toolTableRow>;
    selection = new SelectionModel<toolTableRow>(true, []);
    displayedColumns: string[] = [];
    private unsub = new Subject<void>();

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    removeTool(e: MouseEvent, row: toolTableRow) {
        e.stopPropagation();
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: `¿Are you sure you want to delete this tool deployment?`,
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    const uuid = row.uuid;
                    this.deploymentsService.deleteToolByUUID(uuid).subscribe({
                        next: (response: statusReturn) => {
                            if (response && response['status'] == 'success') {
                                const itemIndex = this.dataset.findIndex(
                                    (obj) => obj['uuid'] === uuid
                                );
                                this.dataset.splice(itemIndex, 1);
                                this.dataSource =
                                    new MatTableDataSource<toolTableRow>(
                                        this.dataset
                                    );
                                this._snackBar.open(
                                    'Successfully deleted tool with uuid: ' +
                                        uuid,
                                    'X',
                                    {
                                        duration: 3000,
                                        panelClass: ['primary-snackbar'],
                                    }
                                );
                            } else {
                                this._snackBar.open(
                                    'Error deleting tool with uuid: ' + uuid,
                                    'X',
                                    {
                                        duration: 3000,
                                        panelClass: ['red-snackbar'],
                                    }
                                );
                            }
                        },
                        error: () => {
                            this._snackBar.open(
                                'Error deleting tool with uuid: ' + uuid,
                                'X',
                                {
                                    duration: 3000,
                                    panelClass: ['red-snackbar'],
                                }
                            );
                        },
                    });
                }
            });
    }

    isToolRunning(row: toolTableRow) {
        return row.status === 'running';
    }

    getToolEndpoints(row: toolTableRow) {
        return row.endpoints;
    }

    getMainEndpoint(row: toolTableRow) {
        const mainEndpoint = row.mainEndpoint;
        if (row.endpoints && row.endpoints[mainEndpoint]) {
            return row.endpoints[mainEndpoint];
        } else {
            return '';
        }
    }

    hasToolErrors(row: toolTableRow) {
        return row.error_msg;
    }

    returnToolBadge(status: string) {
        return getDeploymentBadge(status);
    }

    openToolDetailDialog(row: toolTableRow): void {
        let width = this.mobileQuery.matches ? '300px' : '650px';
        const dialogRef = this.dialog.open(DeploymentDetailComponent, {
            data: { uuid: row.uuid, isTool: true },
            width: width,
            maxWidth: width,
            minWidth: width,
            autoFocus: false,
            restoreFocus: false,
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed', result);
        });
    }

    /** Announce the change in sort state for assistive technology. */
    announceSortChange(sortState: Sort) {
        // This example uses English messages. If your application supports
        // multiple language, you would internationalize these strings.
        // Furthermore, you can customize the message to add additional
        // details about the values being sorted.
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    getToolsList() {
        this.isLoading = true;

        timer(0, 5000)
            .pipe(
                takeUntil(this.unsub),
                switchMap(() => this.deploymentsService.getTools())
            )
            .subscribe((tools) => {
                this.dataset = [];
                this.isLoading = false;
                tools.forEach((tool: Deployment) => {
                    const row: toolTableRow = {
                        uuid: tool.job_ID,
                        name: tool.title,
                        status: tool.status,
                        containerName: tool.docker_image,
                        gpus: '-',
                        creationTime: tool.submit_time,
                        endpoints: tool.endpoints,
                        mainEndpoint: tool.main_endpoint,
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
                    this.dataset.push(row);
                });
                this.dataSource = new MatTableDataSource<toolTableRow>(
                    this.dataset
                );
            });
    }

    isFederatedServer(row: toolTableRow) {
        return row.mainEndpoint.includes('fedserver');
    }

    isSticky(columnDef: string): boolean {
        return columnDef === 'name' ? true : false;
    }

    ngOnInit(): void {
        this.dataset = [];
        this.getToolsList();

        // set table columns
        this.displayedColumns = this.displayedColumns.concat(
            this.columns.filter((x) => !x.hidden).map((x) => x.columnDef)
        ); // pre-fix static
        // add action column
        this.dataSource = new MatTableDataSource<toolTableRow>(this.dataset);

        // set pagination
        //this.dataSource.paginator = this.paginator;
    }

    ngOnDestroy(): void {
        this.unsub.next();
        this.unsub.complete();
    }
}
