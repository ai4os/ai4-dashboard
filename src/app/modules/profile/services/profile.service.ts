import {
    HttpClient,
    HttpHeaders,
    HttpParams,
    HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { statusReturn } from '@app/shared/interfaces/deployment.interface';
import {
    RequestLoginResponse,
    CompleteLoginResponse,
    StorageCredential,
} from '@app/shared/interfaces/profile.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService
    ) {}

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
    ): Observable<statusReturn> {
        const url = `${base}${endpoints.secrets}`;
        const params = new HttpParams()
            .set('vo', this.appConfigService.voName)
            .set('secret_path', '/services/storage/' + serviceName);

        return this.http.post<statusReturn>(url, credential, {
            params: params,
        });
    }
}
