import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { SecretsService } from '@app/modules/deployments/services/secrets-service/secrets.service';
import { Secret } from '@app/shared/interfaces/module.interface';
import { HuggingFaceTokenResponse } from '@app/shared/interfaces/profile.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { environment } from '@environments/environment';
import { Observable, throwError, switchMap, tap, catchError, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HuggingFaceService {
    constructor(
        private http: HttpClient,
        private snackbarService: SnackbarService,
        private injector: Injector
    ) {}

    private get secretsService(): SecretsService {
        return this.injector.get(SecretsService);
    }

    private clientId = 'eb8235ce-5257-426d-ac97-edf66beb7b7e';
    private clientSecret = environment.huggingFaceClientSecret;
    private redirectUri = `${window.location.origin}/profile/huggingface-callback`;
    private scope = 'read-repos';
    private stateKey = 'hf_nonce';

    loginWithHuggingFace(): void {
        const state = crypto.randomUUID();
        localStorage.setItem(this.stateKey, state);

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: this.scope,
            state: state,
        });

        window.location.href = `https://huggingface.co/oauth/authorize?${params.toString()}`;
    }

    validateOAuthRedirect(code: string, state: string): Observable<void> {
        const savedState = localStorage.getItem(this.stateKey);
        localStorage.removeItem(this.stateKey);

        if (state !== savedState || !code) {
            this.snackbarService.openError(
                'Error creating Hugging Face token: OAuth state mismatch or missing code'
            );
            return throwError(
                () => new Error('State mismatch or missing code')
            );
        }

        return this.exchangeCodeForToken(code);
    }

    private exchangeCodeForToken(code: string): Observable<void> {
        const tokenUrl = 'https://huggingface.co/oauth/token';

        const requestBody = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: this.redirectUri,
            client_id: this.clientId,
            client_secret: this.clientSecret,
        });

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        return this.http
            .post<HuggingFaceTokenResponse>(tokenUrl, requestBody.toString(), {
                headers,
            })
            .pipe(
                switchMap((response) => {
                    const accessToken = response.access_token;
                    const token: Secret = {
                        token: accessToken ?? '',
                    };
                    const subpath = '/services/huggingface/token';
                    localStorage.setItem('hf_access_token', accessToken);
                    return this.secretsService.createSecret(token, subpath);
                }),
                tap(() => {
                    this.snackbarService.openSuccess(
                        'Successfully created Hugging Face token'
                    );
                }),
                catchError((err) => {
                    this.snackbarService.openError(
                        'Error creating Hugging Face token'
                    );
                    return throwError(() => err);
                }),
                map(() => void 0)
            );
    }
}
