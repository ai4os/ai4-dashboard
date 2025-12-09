import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { LiteLLMKey } from '@app/shared/interfaces/profile.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { LlmApiKeysService } from '../../services/llm-api-keys-service/llm-api-keys.service';

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
        private snackbarService: SnackbarService
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    protected isLiteLLMLoading = false;
    protected LiteLLMKeys: LiteLLMKey[] = [];
    protected newKeyId = '';

    ngOnInit(): void {
        this.getLiteLLMKeys();
    }

    getLiteLLMKeys() {
        this.isLiteLLMLoading = true;
        this.llmApiKeysService.getLiteLLMKeys().subscribe({
            next: (apiKeys) => {
                apiKeys.forEach((k) => {
                    const newApiKey: LiteLLMKey = {
                        id: k.id,
                        createdAt: k.created_at,
                    };
                    this.LiteLLMKeys.push(newApiKey);
                });
            },
            error: () => {
                this.snackbarService.openError(
                    "Couldn't retrieve LiteLLM keys. Please try again later."
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
        this.llmApiKeysService.createLiteLLMKey(cleanKeyId).subscribe({
            next: (apiKey) => {
                const newApiKey: LiteLLMKey = {
                    id: cleanKeyId,
                    createdAt: new Date().toISOString(),
                };
                this.LiteLLMKeys.push(newApiKey);
                this.snackbarService.openSuccess(
                    'Successfully created LiteLLM key with ID: ' + cleanKeyId
                );
                this.newKeyId = '';
            },
            error: () => {
                this.snackbarService.openError(
                    "Couldn't retrieve LiteLLM keys. Please try again later."
                );
            },
        });
    }

    deleteLiteLLMKey(keyId: string) {
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: `Are you sure you want to revoke this LiteLLM key?`,
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.llmApiKeysService.deleteLiteLLMKey(keyId).subscribe({
                        next: () => {
                            this.LiteLLMKeys = this.LiteLLMKeys.filter(
                                (k) => k.id !== keyId
                            );
                            this.snackbarService.openSuccess(
                                'Successfully deleted LiteLLM key with ID: ' +
                                    keyId
                            );
                        },
                        error: () => {
                            this.snackbarService.openError(
                                "Couldn't delete LiteLLM key. Please try again later."
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
