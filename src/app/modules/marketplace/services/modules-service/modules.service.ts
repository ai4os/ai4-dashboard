import { module } from './../tools-service/tools.service.mock';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
    Module,
    ModuleConfiguration,
    ModuleSummary,
    GradioCreateResponse,
    GradioDeployment,
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

    getModule(moduleName: string): Observable<Module> {
        const url = `${base}${endpoints.module.replace(':name', moduleName)}`;
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

    createDeploymentGradio(
        moduleName: string
    ): Observable<GradioCreateResponse> {
        const url = `${base}${endpoints.nomadGradioDeployments}`;
        const params = new HttpParams().set('module_name', moduleName);
        const body = {};
        return this.http.post<GradioCreateResponse>(url, body, {
            params: params,
        });
    }

    getDeploymentGradio(deploymentUUID: string): Observable<GradioDeployment> {
        const url = `${base}${endpoints.nomadGradioDeployment.replace(
            ':deployment_uuid',
            deploymentUUID
        )}`;
        return this.http.get<GradioDeployment>(url, {});
    }
}
