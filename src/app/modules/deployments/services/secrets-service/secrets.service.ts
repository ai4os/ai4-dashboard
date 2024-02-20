import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { statusReturn } from '@app/shared/interfaces/deployment.interface';
import { Secret } from '@app/shared/interfaces/module.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class SecretsService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService
    ) {}

    readonly voParam = new HttpParams().set('vo', this.appConfigService.voName);

    getSecrets(subpath: string): Observable<Secret[]> {
        const url = `${base}${endpoints.secrets}`;
        let params = new HttpParams()
            .set('vo', this.appConfigService.voName)
            .set('subpath', subpath);

        return this.http.get<Array<Secret>>(url, {
            params: params,
        });
    }

    createSecret(secret: Secret, secretPath: string): Observable<statusReturn> {
        const url = `${base}${endpoints.secrets}`;
        let params = new HttpParams()
            .set('vo', this.appConfigService.voName)
            .set('secret_path', secretPath);

        return this.http.post<statusReturn>(url, secret, {
            params: params,
        });
    }

    deleteSecret(secretPath: string): Observable<statusReturn> {
        const url = `${base}${endpoints.secrets}`;
        let params = new HttpParams()
            .set('vo', this.appConfigService.voName)
            .set('secret_path', secretPath);

        return this.http.delete<statusReturn>(url, {
            params: params,
        });
    }
}
