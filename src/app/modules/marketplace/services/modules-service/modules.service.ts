import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
    Module,
    ModuleConfiguration,
    ModuleSummary,
    Service,
} from '@app/shared/interfaces/module.interface';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { TagObject } from '@app/data/types/tags';

const { base, clusterBase, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class ModulesService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService
    ) {}

    readonly voParam = new HttpParams().set('vo', this.appConfigService.voName);
    bearerToken: string | undefined;

    getModulesSummary(tags?: any): Observable<ModuleSummary[]> {
        const url = `${base}${endpoints.modulesSummary}`;
        if (tags) {
            let params = new HttpParams();
            Object.keys(tags).forEach((key: string) => {
                params = params.set(key, tags[key]);
            });
            return this.http.get<Array<ModuleSummary>>(url, { params });
        } else {
            return this.http.get<Array<ModuleSummary>>(url);
        }
    }

    getModule(moduleName: string): Observable<Module> {
        const url = `${base}${endpoints.module.replace(':name', moduleName)}`;
        console.log('URL', url);
        return this.http.get<Module>(url);
    }

    getModuleConfiguration(
        moduleName: string
    ): Observable<ModuleConfiguration> {
        const url = `${base}${endpoints.moduleConfiguration.replace(
            ':name',
            moduleName
        )}`;
        return this.http.get<ModuleConfiguration>(url, {
            params: this.voParam,
        });
    }

    //OSCAR cluster
    setToken(token: string) {
        this.bearerToken = token;
    }

    /**
     * Get list of services in OSCAR
     * @returns Service list
     */
    getServices(): Observable<Service[]> {
        const url = `${clusterBase}${endpoints.services}`;
        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${this.bearerToken}`
        );
        return this.http.get<Service[]>(url, { headers });
    }

    runService(serviceName: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);

        const url = `${clusterBase}${endpoints.runService.replace(
            ':name',
            serviceName
        )}`;
        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${this.bearerToken}`
        );
        return this.http.post(url, formData, { headers });
    }
}
