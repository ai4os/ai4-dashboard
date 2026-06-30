import { Component, OnInit, computed, signal, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { UiTableColumn } from '@app/shared/components/ui/ui-table/ui-table.component';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { StatusReturn } from '@app/shared/interfaces/deployment.interface';
import { LlmApiKeysService } from '@app/modules/profile/services/llm-api-keys-service/llm-api-keys.service';
import { ApiKeyPopupComponent } from '../../api-key-popup/api-key-popup.component';
import {
    ApiKeyRow,
    LlmApiKeysStore,
} from '@app/modules/profile/store/llm-api-keys.store';

@Component({
    selector: 'app-api-keys-tab',
    templateUrl: './api-keys-tab.component.html',
    styleUrl: './api-keys-tab.component.scss',
})
export class ApiKeysTabComponent implements OnInit {
    private store = inject(LlmApiKeysStore);

    constructor(
        private llmApiKeysService: LlmApiKeysService,
        private snackbarService: SnackbarService,
        private confirmationDialog: MatDialog,
        private dialog: MatDialog,
        private media: MediaMatcher
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
    }

    private mobileQuery: MediaQueryList;

    columns: UiTableColumn<ApiKeyRow>[] = [
        { key: 'name', label: 'PROFILE.API-KEYS-TAB.TABLE.KEY-ID' },
        {
            key: 'createdAt',
            label: 'PROFILE.API-KEYS-TAB.TABLE.CREATED',
            align: 'center',
        },
        {
            key: 'expires',
            label: 'PROFILE.API-KEYS-TAB.TABLE.EXPIRES',
            align: 'center',
        },
        {
            key: 'actions',
            label: 'PROFILE.API-KEYS-TAB.TABLE.ACTIONS',
            align: 'center',
            width: '80px',
        },
    ];

    apiKeys = this.store.apiKeys;
    loading = this.store.loading;

    expanded = signal(false);
    keyName = signal('');
    expiryDate = signal<Date | null>(
        new Date(new Date().setMonth(new Date().getMonth() + 1))
    );
    today = new Date();

    creating = signal(false);
    canCreate = computed(
        () => this.keyName().trim().length > 0 && !this.creating()
    );

    ngOnInit(): void {
        this.store.ensureLoaded();
    }

    createKey(): void {
        const cleanKeyId = this.keyName().trim().replace(/\s+/g, '');
        if (!cleanKeyId) return;

        if (this.store.hasKeyId(cleanKeyId)) {
            this.snackbarService.openError(
                'LLM API key with the same ID already exists. Please choose a different ID.'
            );
            return;
        }

        const duration = this.calculateExpirationDiff(this.expiryDate());
        this.creating.set(true);

        this.llmApiKeysService
            .createLiteLLMKey(cleanKeyId, duration)
            .subscribe({
                next: (apiKey) => {
                    this.store.addKey({
                        id: cleanKeyId,
                        name: cleanKeyId,
                        createdAt: new Date(),
                        expires: this.expiryDate(),
                    });

                    this.keyName.set('');
                    this.expanded.set(false);

                    const width = this.mobileQuery.matches ? '300px' : '650px';
                    this.dialog.open(ApiKeyPopupComponent, {
                        data: { apiKey },
                        width,
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
                error: () => {
                    this.snackbarService.openError(
                        "Couldn't create LLM API key. Please try again later."
                    );
                },
                complete: () => this.creating.set(false),
            });
    }

    deleteKey(id: string): void {
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: 'Are you sure you want to revoke this LLM API key?',
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (!confirmed) return;

                this.llmApiKeysService.deleteLiteLLMKey(id).subscribe({
                    next: (response: StatusReturn) => {
                        if (response?.status === 'success') {
                            this.store.removeKey(id);
                            this.snackbarService.openSuccess(
                                'Successfully deleted LLM API key with ID: ' +
                                    id
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
            });
    }

    isExpiringSoon(expires: Date | null): boolean {
        if (!expires) return false;
        const diffMs = expires.getTime() - Date.now();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return diffDays > 0 && diffDays <= 7;
    }

    private calculateExpirationDiff(expirationDate: Date | null): string {
        if (!expirationDate) return '';
        const diffMs = expirationDate.getTime() - Date.now();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return `${Math.max(diffDays, 1)}d`;
    }
}
