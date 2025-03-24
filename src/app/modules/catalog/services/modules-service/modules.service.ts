import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
    Ai4lifeModule,
    Ai4eoscModule,
    ModuleConfiguration,
    ModuleSummary,
} from '@app/shared/interfaces/module.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class ModulesService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService
    ) {}

    readonly voParam = new HttpParams().set('vo', this.appConfigService.voName);

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

    getModule(moduleName: string): Observable<Ai4eoscModule> {
        const url = `${base}${endpoints.module.replace(':name', moduleName)}`;
        return this.http.get<Ai4eoscModule>(url);
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

    getAi4lifeModules(): Observable<Ai4lifeModule[]> {
        const url = endpoints.ai4lifeModulesSummary;
        return this.http.get<Array<any>>(url).pipe(
            map((data) =>
                Object.values(data).map((item) => ({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    doi: item.id,
                    created: item.created.slice(0, 10),
                    covers: item.covers,
                    downloadCount: item.download_count,
                    tags: item.tags,
                    license: item.license,
                }))
            )
        );
    }
}
