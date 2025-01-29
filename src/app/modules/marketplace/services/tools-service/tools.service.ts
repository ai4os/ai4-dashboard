import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { TagObject } from '@app/data/types/tags';
import {
    Ai4LifeLoaderToolConfiguration,
    CvatToolConfiguration,
    FederatedServerToolConfiguration,
    Ai4eoscModule,
    ModuleSummary,
} from '@app/shared/interfaces/module.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class ToolsService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService
    ) {}

    readonly voParam = new HttpParams().set('vo', this.appConfigService.voName);

    getToolsSummary(tags?: TagObject): Observable<ModuleSummary[]> {
        const url = `${base}${endpoints.toolsSummary}`;
        if (tags) {
            let params = new HttpParams();
            Object.keys(tags).forEach((key: string) => {
                params = params.set(key, tags[key as keyof TagObject] || '');
            });
            return this.http.get<Array<ModuleSummary>>(url, { params });
        } else {
            return this.http.get<Array<ModuleSummary>>(url);
        }
    }

    getTool(moduleName: string): Observable<Ai4eoscModule> {
        const url = `${base}${endpoints.tool.replace(':name', moduleName)}`;
        return this.http.get<Ai4eoscModule>(url);
    }

    getFederatedServerConfiguration(
        toolName: string
    ): Observable<FederatedServerToolConfiguration> {
        const url = `${base}${endpoints.toolConfiguration.replace(
            ':name',
            toolName
        )}`;
        return this.http.get<FederatedServerToolConfiguration>(url, {
            params: this.voParam,
        });
    }

    getCvatConfiguration(toolName: string): Observable<CvatToolConfiguration> {
        const url = `${base}${endpoints.toolConfiguration.replace(
            ':name',
            toolName
        )}`;
        return this.http.get<CvatToolConfiguration>(url, {
            params: this.voParam,
        });
    }

    getAi4LifeConfiguration(
        toolName: string
    ): Observable<Ai4LifeLoaderToolConfiguration> {
        const url = `${base}${endpoints.toolConfiguration.replace(
            ':name',
            toolName
        )}`;
        return this.http.get<Ai4LifeLoaderToolConfiguration>(url, {
            params: this.voParam,
        });
    }
}
