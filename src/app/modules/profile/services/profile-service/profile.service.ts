import {
    HttpClient,
    HttpHeaders,
    HttpParams,
    HttpResponse,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { SecretsService } from '@app/modules/deployments/services/secrets-service/secrets.service';
import { StatusReturn } from '@app/shared/interfaces/deployment.interface';
import { Secret } from '@app/shared/interfaces/module.interface';
import {
    RequestLoginResponse,
    CompleteLoginResponse,
    StorageCredential,
    HuggingFaceTokenResponse,
} from '@app/shared/interfaces/profile.interface';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { environment } from '@environments/environment';
import { catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService,
        private snackbarService: SnackbarService,
        private injector: Injector
    ) {}

    private get secretsService(): SecretsService {
        return this.injector.get(SecretsService);
    }

    /*************************************************/
    /******************* NEXTCLOUD *******************/
    /*************************************************/

    initLogin(domain: string): Observable<RequestLoginResponse> {
        const url = 'https://' + domain + '/index.php/login/v2';
        const body = {};
        return this.http.post<RequestLoginResponse>(url, body);
    }

    getNewCredentials(
        loginResponse: RequestLoginResponse
    ): Observable<HttpResponse<CompleteLoginResponse>> {
        const url = loginResponse.poll.endpoint;
        const body = `token=${loginResponse.poll.token}`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        return this.http.post<CompleteLoginResponse>(url, body, {
            headers,
            observe: 'response',
        });
    }

    getExistingCredentials(): Observable<StorageCredential[]> {
        const url = `${base}${endpoints.secrets}`;
        const params = new HttpParams()
            .set('vo', this.appConfigService.voName)
            .set('subpath', '/services/storage');

        return this.http.get<Array<StorageCredential>>(url, {
            params: params,
        });
    }

    addCredential(
        credential: StorageCredential,
        serviceName: string
    ): Observable<StatusReturn> {
        const url = `${base}${endpoints.secrets}`;
        const params = new HttpParams()
            .set('vo', this.appConfigService.voName)
            .set('secret_path', '/services/storage/' + serviceName);

        return this.http.post<StatusReturn>(url, credential, {
            params: params,
        });
    }

    deleteCredential(serviceName: string): Observable<StatusReturn> {
        const url = `${base}${endpoints.secrets}`;
        const params = new HttpParams()
            .set('vo', this.appConfigService.voName)
            .set('secret_path', '/services/storage/' + serviceName);

        return this.http.delete<StatusReturn>(url, {
            params: params,
        });
    }

    /*************************************************/
    /***************** HUGGING FACE ******************/
    /*************************************************/
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
