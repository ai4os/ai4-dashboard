import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { SecretsService } from '@app/modules/deployments/services/secrets-service/secrets.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { MLflowCredentials } from '@app/shared/interfaces/profile.interface';

@Component({
    selector: 'app-ai4eosc-services',
    templateUrl: './ai4eosc-services.component.html',
    styleUrl: './ai4eosc-services.component.scss',
})
export class Ai4eoscServicesComponent implements OnInit {
    constructor(
        private secretsService: SecretsService,
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

    protected mlflowCredentials: MLflowCredentials = {
        username: '',
        password: {
            value: '',
            hide: true,
        },
    };

    ngOnInit(): void {
        this.getMLflowCredentials();
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
}
