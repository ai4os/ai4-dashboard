import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { APIsixKey } from '@app/shared/interfaces/profile.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { ApisixService } from '../../services/apisix-service/apisix.service';

@Component({
    selector: 'app-api-keys',
    templateUrl: './api-keys.component.html',
    styleUrl: './api-keys.component.scss',
})
export class ApiKeysComponent implements OnInit {
    constructor(
        private apiSixService: ApisixService,
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

    protected isAPIsixLoading = false;
    protected apisixKeys: APIsixKey[] = [];
    protected newKeyId = '';

    ngOnInit(): void {
        this.getAPIsixKeys();
    }

    getAPIsixKeys() {
        this.isAPIsixLoading = true;
        this.apiSixService.getApisixKeys().subscribe({
            next: (apiKeys) => {
                apiKeys.forEach((k) => {
                    const newApiKey: APIsixKey = {
                        id: k.id,
                        key: {
                            value: k.api_key,
                            hide: true,
                        },
                    };
                    this.apisixKeys.push(newApiKey);
                });
            },
            error: () => {
                this.snackbarService.openError(
                    "Couldn't retrieve APISix keys. Please try again later."
                );
                this.isAPIsixLoading = false;
            },
            complete: () => {
                this.isAPIsixLoading = false;
            },
        });
    }

    createAPIsixKey(keyId: string) {
        const cleanKeyId = keyId.replace(/\s+/g, '');
        this.apiSixService.createApisixKey(cleanKeyId).subscribe({
            next: (apiKey) => {
                const newApiKey: APIsixKey = {
                    id: cleanKeyId,
                    key: {
                        value: apiKey,
                        hide: true,
                    },
                };
                this.apisixKeys.push(newApiKey);
                this.snackbarService.openSuccess(
                    'Successfully created APISix key with ID: ' + cleanKeyId
                );
                this.newKeyId = '';
            },
            error: () => {
                this.snackbarService.openError(
                    "Couldn't retrieve APISix keys. Please try again later."
                );
            },
        });
    }

    deleteAPIsixKey(keyId: string) {
        this.confirmationDialog
            .open(ConfirmationDialogComponent, {
                data: `Are you sure you want to revoke this APISix key?`,
            })
            .afterClosed()
            .subscribe((confirmed: boolean) => {
                if (confirmed) {
                    this.apiSixService.deleteApisixKey(keyId).subscribe({
                        next: () => {
                            this.apisixKeys = this.apisixKeys.filter(
                                (k) => k.id !== keyId
                            );
                            this.snackbarService.openSuccess(
                                'Successfully deleted APISix key with ID: ' +
                                    keyId
                            );
                        },
                        error: () => {
                            this.snackbarService.openError(
                                "Couldn't delete APISix key. Please try again later."
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
