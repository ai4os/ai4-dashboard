import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
    Module,
    ModuleConfiguration,
    ModuleSummary,
} from '@app/shared/interfaces/module.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
const { endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class ModulesService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService
    ) {}

    readonly voParam = new HttpParams().set('vo', this.appConfigService.voName);
    private readonly base = this.appConfigService.apiURL;

    getModulesSummary(tags?: any): Observable<ModuleSummary[]> {
        const url = `${this.base}${endpoints.modulesSummary}`;
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
        const url = `${this.base}${endpoints.module.replace(':name', moduleName)}`;
        return this.http.get<Module>(url);
    }

    getModuleConfiguration(
        moduleName: string
    ): Observable<ModuleConfiguration> {
        const url = `${this.base}${endpoints.moduleConfiguration.replace(
            ':name',
            moduleName
        )}`;
        return this.http.get<ModuleConfiguration>(url, {
            params: this.voParam,
        });
    }
}
