import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { TagObject } from '@app/data/types/tags';
import {
    CvatToolConfiguration,
    FederatedServerToolConfiguration,
    LlmToolConfiguration,
    Module,
    ModuleSummary,
    VllmModelConfig,
} from '@app/shared/interfaces/module.interface';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';
import * as yaml from 'js-yaml';

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

    getTool(moduleName: string): Observable<Module> {
        const url = `${base}${endpoints.tool.replace(':name', moduleName)}`;
        return this.http.get<Module>(url);
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

    getVllmConfiguration(toolName: string): Observable<LlmToolConfiguration> {
        const url = `${base}${endpoints.toolConfiguration.replace(
            ':name',
            toolName
        )}`;
        return this.http.get<LlmToolConfiguration>(url, {
            params: this.voParam,
        });
    }

    getVllmModelConfiguration(): Observable<VllmModelConfig[]> {
        const url =
            'https://raw.githubusercontent.com/ai4os/ai4-papi/feat/vllm-tools/etc/vllm.yaml';
        return this.http.get(url, { responseType: 'text' }).pipe(
            map((yamlText) => {
                const parsedYaml = yaml.load(yamlText) as {
                    models: Record<string, Omit<VllmModelConfig, 'name'>>;
                };

                return Object.entries(parsedYaml.models).map(
                    ([name, config]) => ({
                        name, // model name
                        ...config,
                    })
                );
            })
        );
    }
}
