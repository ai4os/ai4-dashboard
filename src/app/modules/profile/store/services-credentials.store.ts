import { computed, Injectable, signal } from '@angular/core';
import { SecretsService } from '@app/modules/deployments/services/secrets-service/secrets.service';
import { HuggingFaceService } from '@app/modules/profile/services/hugging-face-service/hugging-face.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';

interface MLflowCredentialsValue {
    username: string;
    password: string;
}

@Injectable({ providedIn: 'root' })
export class ServicesCredentialsStore {
    constructor(
        private secretsService: SecretsService,
        private huggingFaceService: HuggingFaceService,
        private snackbarService: SnackbarService
    ) {}

    readonly loading = computed(
        () => this._isMLflowLoading() || this._isHfLoading()
    );

    // ---- MLflow ----
    private readonly _mlflowCredentials = signal<MLflowCredentialsValue>({
        username: '',
        password: '',
    });
    private readonly _isMLflowLoading = signal(false);
    private mlflowLoaded = false;

    readonly mlflowCredentials = this._mlflowCredentials.asReadonly();
    readonly isMLflowLoading = this._isMLflowLoading.asReadonly();

    // ---- Hugging Face ----
    private readonly _hfToken = signal('');
    private readonly _isHfLoading = signal(false);
    private hfLoaded = false;

    readonly hfToken = this._hfToken.asReadonly();
    readonly isHfLoading = this._isHfLoading.asReadonly();

    ensureLoaded(): void {
        this.ensureMLflowLoaded();
        this.ensureHfLoaded();
    }

    private ensureMLflowLoaded(): void {
        if (this.mlflowLoaded || this._isMLflowLoading()) return;

        this._isMLflowLoading.set(true);
        this.secretsService.getSecrets('/services/mlflow').subscribe({
            next: (mlflowTokens) => {
                const mlflowSecrets = Object.values(mlflowTokens);
                if (mlflowSecrets.length > 0) {
                    this._mlflowCredentials.set({
                        username: mlflowSecrets[0].username ?? '',
                        password: mlflowSecrets[0].password ?? '',
                    });
                }
                this.mlflowLoaded = true;
                this._isMLflowLoading.set(false);
            },
            error: () => {
                this.snackbarService.openError(
                    "Couldn't retrieve MLFlow credentials. Please try again later."
                );
                this._isMLflowLoading.set(false);
            },
        });
    }

    private ensureHfLoaded(): void {
        if (this.hfLoaded || this._isHfLoading()) return;

        this._isHfLoading.set(true);
        this.secretsService.getSecrets('/services/huggingface').subscribe({
            next: (hfTokens) => {
                const hfSecrets = Object.values(hfTokens);
                if (hfSecrets.length > 0) {
                    this._hfToken.set(hfSecrets[0].token ?? '');
                }
                this.hfLoaded = true;
                this._isHfLoading.set(false);
            },
            error: () => {
                this.snackbarService.openError(
                    "Couldn't retrieve credentials. Please try again later."
                );
                this._isHfLoading.set(false);
            },
        });
    }

    startLoginWithHuggingFace(): void {
        this.huggingFaceService.loginWithHuggingFace();
    }

    unsyncHuggingFace(): void {
        this._isHfLoading.set(true);
        this.secretsService
            .deleteSecret('/services/huggingface/token')
            .subscribe({
                next: () => {
                    this._hfToken.set('');
                    localStorage.removeItem('hf_access_token');
                    this._isHfLoading.set(false);
                    this.snackbarService.openSuccess(
                        'Successfully deleted Hugging Face token'
                    );
                },
                error: () => {
                    this._isHfLoading.set(false);
                    this.snackbarService.openError(
                        'Error deleting Hugging Face token'
                    );
                },
            });
    }

    reloadHf(): void {
        this.hfLoaded = false;
        this.ensureHfLoaded();
    }
}
