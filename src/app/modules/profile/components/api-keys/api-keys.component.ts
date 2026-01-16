import { MediaMatcher } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import {
    KeyTableColumn,
    KeyTableRow,
    LiteLLMKey,
    VoInfo,
} from '@app/shared/interfaces/profile.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { LlmApiKeysService } from '../../services/llm-api-keys-service/llm-api-keys.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { StatusReturn } from '@app/shared/interfaces/deployment.interface';
import { ApiKeyPopupComponent } from '../api-key-popup/api-key-popup.component';

export function formatDate(input: string): string {
    const date = typeof input === 'string' ? new Date(input) : input;

    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(date);

    const year = parts.find((p) => p.type === 'year')?.value;
    const month = parts.find((p) => p.type === 'month')?.value;
    const day = parts.find((p) => p.type === 'day')?.value;
    const hour = parts.find((p) => p.type === 'hour')?.value;
    const minute = parts.find((p) => p.type === 'minute')?.value;
    const second = parts.find((p) => p.type === 'second')?.value;

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

@Component({
    selector: 'app-api-keys',
    templateUrl: './api-keys.component.html',
    styleUrl: './api-keys.component.scss',
})
export class ApiKeysComponent implements OnInit {
    constructor(
        private llmApiKeysService: LlmApiKeysService,
        public confirmationDialog: MatDialog,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        public dialog: MatDialog,
        private snackbarService: SnackbarService
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }
    @ViewChild(MatSort) set matSort(sort: MatSort) {
        this.dataSource.sort = sort;
    }

    @Input() vos: VoInfo[] = [];

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    protected isLiteLLMLoading = false;
    protected LiteLLMKeys: LiteLLMKey[] = [];
    protected newKeyId = '';
    protected teamsIds: Set<string> = new Set<string>();
    protected teamId: string = '';

    protected dataset: Array<KeyTableRow> = [];
    protected dataSource: MatTableDataSource<KeyTableRow> =
        new MatTableDataSource<KeyTableRow>(this.dataset);
    protected columns: Array<KeyTableColumn> = [
        { columnDef: 'id', header: 'PROFILE.API-KEYS.TABLE.KEY-ID' },
        {
            columnDef: 'creationTime',
            header: 'PROFILE.API-KEYS.TABLE.CREATION-TIME',
        },
        {
            columnDef: 'teamId',
            header: 'PROFILE.API-KEYS.TABLE.TEAM-ID',
        },
        { columnDef: 'actions', header: 'PROFILE.API-KEYS.TABLE.ACTIONS' },
    ];
    protected displayedColumns: string[] = this.columns.map((x) => x.columnDef);

    ngOnInit(): void {
        this.getTeamsIds();
        this.getLiteLLMKeys();
    }

    getTeamsIds() {
        this.vos.forEach((vo) => {
            vo.roles.forEach((role) => {
                this.teamsIds.add(role);
            });
        });

        const order = ['ap-d', 'ap-u', 'ap-b', 'ap-a1', 'ap-a', 'ap-0'];
        this.teamsIds = new Set(
            [...this.teamsIds].sort(
                (a, b) => order.indexOf(a) - order.indexOf(b)
            )
        );
        this.teamId = this.teamsIds.values().next().value!;
    }

    getLiteLLMKeys() {
        this.isLiteLLMLoading = true;
        this.llmApiKeysService.getLiteLLMKeys().subscribe({
            next: (apiKeys) => {
                this.dataset = [];
                apiKeys.forEach((k) => {
                    const row: KeyTableRow = {
                        id: k.id,
                        creationTime: formatDate(k.created_at),
                        teamId: k.team_id,
                    };
                    this.dataset.push(row);
                });
                this.dataSource = new MatTableDataSource<KeyTableRow>(
                    this.dataset
                );
            },
            error: () => {
                this.snackbarService.openError(
                    "Couldn't retrieve LLM API keys. Please try again later."
                );
                this.isLiteLLMLoading = false;
            },
            complete: () => {
                this.isLiteLLMLoading = false;
            },
        });
    }

    createLiteLLMKey(keyId: string) {
        const cleanKeyId = keyId.replace(/\s+/g, '');
        if (this.dataset.filter((d) => d.id === cleanKeyId).length > 0) {
            this.snackbarService.openError(
                'LLM API key with the same ID already exists. Please choose a different ID.'
            );
            return;
        }
        this.llmApiKeysService
            .createLiteLLMKey(cleanKeyId, this.teamId)
            .subscribe({
                next: (apiKey) => {
                    const row: KeyTableRow = {
                        id: cleanKeyId,
                        creationTime: formatDate(new Date().toISOString()),
                        teamId: this.teamId,
                    };
                    this.dataset.push(row);
                    this.dataSource = new MatTableDataSource<KeyTableRow>(
                        this.dataset
                    );
                    this.newKeyId = '';
                    const width = this.mobileQuery.matches ? '300px' : '650px';
                    this.dialog.open(ApiKeyPopupComponent, {
                        data: {
                            apiKey: apiKey,
                        },
                        width: width,
                        maxWidth: width,
                        minWidth: width,
                        autoFocus: false,
                        restoreFocus: false,
                    });
                    this.snackbarService.openSuccess(
                        'Successfully created LLM API key with ID: ' +
                            cleanKeyId
                    );
                },
                error: (e) => {
                    this.snackbarService.openError(
                        "Couldn't create LLM API key. Please try again later."
                    );
                },
            });
    }

    deleteLiteLLMKey(e: MouseEvent, row: KeyTableRow) {
        e.stopPropagation();
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: `Are you sure you want to revoke this LLM API key?`,
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.llmApiKeysService.deleteLiteLLMKey(row.id).subscribe({
                        next: (response: StatusReturn) => {
                            if (response && response['status'] == 'success') {
                                const itemIndex = this.dataset.findIndex(
                                    (obj) => obj['id'] === row.id
                                );
                                this.dataset.splice(itemIndex, 1);
                                this.dataSource =
                                    new MatTableDataSource<KeyTableRow>(
                                        this.dataset
                                    );
                                this.snackbarService.openSuccess(
                                    'Successfully deleted LLM API key with ID: ' +
                                        row.id
                                );
                            } else {
                                this.snackbarService.openError(
                                    "Couldn't delete LLM API key. Please try again later."
                                );
                            }
                        },
                        error: () => {
                            this.snackbarService.openError(
                                "Couldn't delete LLM API key. Please try again later."
                            );
                        },
                    });
                }
            });
    }

    openApiLlmDocumentation(): void {
        const url =
            'https://docs.ai4eosc.eu/en/latest/reference/llm.html#integrate-it-with-your-own-services';
        window.open(url);
    }
}
