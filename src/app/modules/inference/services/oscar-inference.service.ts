import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { TrainModuleRequest } from '@app/shared/interfaces/module.interface';
import { OscarService } from '@app/shared/interfaces/oscar-service.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class OscarInferenceService {
    http = inject(HttpClient);
    appConfigService = inject(AppConfigService);

    getServices(): Observable<OscarService[]> {
        const url = `${base}${endpoints.oscarServices}`;
        const params = new HttpParams()
            .set('vo', this.appConfigService.voName)
            .set('public', false);
        return this.http.get<OscarService[]>(url, {
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

    createService(serviceConf: TrainModuleRequest): Observable<string> {
        const url = `${base}${endpoints.oscarServices}`;
        const params = new HttpParams().set('vo', this.appConfigService.voName);
        return this.http.post<string>(url, serviceConf, {
            params: params,
        });
    }

    deleteServiceByName(name: string): Observable<string> {
        const url = `${base}${endpoints.oscarServiceByName.replace(
            ':serviceName',
            name
        )}`;
        const params = new HttpParams()
            .set('vo', this.appConfigService.voName)
            .set('service_name', name);
        return this.http.delete<string>(url, {
            params: params,
        });
    }
}
