import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { SecretsService } from '@app/modules/deployments/services/secrets-service/secrets.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import {
    APIsixKey,
    MLflowCredentials,
} from '@app/shared/interfaces/profile.interface';
import { ApisixService } from '../../services/apisix-service/apisix.service';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-ai4os-services',
    templateUrl: './ai4os-services.component.html',
    styleUrl: './ai4os-services.component.scss',
})
export class Ai4osServicesComponent implements OnInit {
    constructor(
        private secretsService: SecretsService,
        private apiSixService: ApisixService,
        private appConfigService: AppConfigService,
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

    protected isMLflowLoading = false;
    protected isAPIsixLoading = false;

    protected mlflowCredentials: MLflowCredentials = {
        username: '',
        password: {
            value: '',
            hide: true,
        },
    };
    protected apisixKeys: APIsixKey[] = [];

    protected newKeyId = '';

    ngOnInit(): void {
        this.getMLflowCredentials();
        this.getAPIsixKeys();
    }

    getMLflowCredentials() {
        this.isMLflowLoading = true;
        this.secretsService.getSecrets('/services/mlflow').subscribe({
            next: (mlflowTokens) => {
                const mlflowSecrets = Object.values(mlflowTokens);
                if (mlflowSecrets.length > 0) {
                    this.mlflowCredentials.username =
                        mlflowSecrets[0].username ?? '';
                    this.mlflowCredentials.password.value =
                        mlflowSecrets[0].password ?? '';
                }
            },
            error: () => {
                this.snackbarService.openError(
                    "Couldn't retrieve MLFlow credentials. Please try again later."
                );
                this.isMLflowLoading = false;
            },
            complete: () => {
                this.isMLflowLoading = false;
            },
        });
    }

    syncMlflow() {
        let url = '';
        if (this.appConfigService.projectName === 'iMagine') {
            url = 'https://mlflow.cloud.imagine-ai.eu/signup';
        } else {
            url = 'https://mlflow.cloud.ai4eosc.eu/signup';
        }
        window.open(url);
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
}
