import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { OscarService } from '@app/shared/interfaces/oscar-service.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class OscarInferenceService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService
    ) {}

    getServices(): Observable<OscarService[]> {
        const url = `${base}${endpoints.oscarServices}`;
        const params = new HttpParams()
            .set('vo', this.appConfigService.voName)
            .set('public', false);
        return this.http.get<Array<OscarService>>(url, {
            params: params,
        });
    }

    getServiceByName(name: string): Observable<OscarService> {
        const url = `${base}${endpoints.oscarServiceByName.replace(
            ':serviceName',
            name
        )}`;
        const params = new HttpParams().set('vo', this.appConfigService.voName);
        return this.http.get<OscarService>(url, {
            params: params,
        });
    }

    deleteServiceByName(name: string): Observable<string> {
        const url = `${base}${endpoints.oscarServiceByName.replace(
            ':serviceName',
            name
        )}`;
        const params = new HttpParams().set('vo', this.appConfigService.voName);
        return this.http.delete<string>(url, {
            params: params,
        });
    }
}
