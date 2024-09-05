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
    Service,
} from '@app/shared/interfaces/module.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { Client } from '@grycap/oscar-js';
import { OAuthStorage } from 'angular-oauth2-oidc';
const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class ModulesService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService,
        private authStorage: OAuthStorage
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

    getAccessToken() {
        const oidc_token = this.authStorage.getItem('access_token');
        if (!oidc_token) {
            throw new Error('Authorization error. the token cannot be null.');
        }
        return oidc_token;
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

    //OSCAR cluster
    /**
     * Get list of services in OSCAR
     * @returns Service list
     */
    getServices(oscar_endpoint: string): Promise<Service[]> {
        const oidc_token = this.getAccessToken();
        const client: Client = new Client({
            clusterId: '1',
            oscar_endpoint,
            oidc_token,
        });
        return client.getServices();
    }

    /**
     * Run service in OSCAR usign sync inovoation
     * @param oscar_endpoint oscar endpoint
     * @param serviceName module name
     * @param file file to run
     * @returns response with the result of the service.
     */
    runService(
        oscar_endpoint: string,
        serviceName: string,
        file: string
    ): Promise<any> {
        const oidc_token = this.getAccessToken();
        const client: Client = new Client({
            clusterId: '1',
            oscar_endpoint,
            oidc_token,
        });

        return client.runService(serviceName, file);
    }

    /**
     * Create new service in OSCAR
     * @param oscar_endpoint oscare endpoint
     * @param service service object to create
     * @returns service created
     */
    createService(oscar_endpoint: string, service: Service) {
        const oidc_token = this.getAccessToken();
        const client: Client = new Client({
            clusterId: '1',
            oscar_endpoint,
            oidc_token,
        });

        const request: any = {
            ...service,
        };
        return client.createService(request);
    }
}
