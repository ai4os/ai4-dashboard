import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { StatusReturn } from '@app/shared/interfaces/deployment.interface';
import {
    GradioCreateResponse,
    GradioDeployment,
} from '@app/shared/interfaces/module.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class TryMeService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService
    ) {}

    readonly voParam = new HttpParams().set('vo', this.appConfigService.voName);

    createDeploymentGradio(
        moduleName: string,
        moduleTitle: string
    ): Observable<GradioCreateResponse> {
        const url = `${base}${endpoints.nomadTryMeDeployments}`;
        const params = new HttpParams()
            .set('module_name', moduleName)
            .set('title', moduleTitle);
        const body = {};
        return this.http.post<GradioCreateResponse>(url, body, {
            params: params,
        });
    }

    getDeploymentGradioByUUID(
        deploymentUUID: string
    ): Observable<GradioDeployment> {
        const url = `${base}${endpoints.nomadTryMeDeployment.replace(
            ':deployment_uuid',
            deploymentUUID
        )}`;
        return this.http.get<GradioDeployment>(url, {});
    }

    getDeploymentsGradio(): Observable<GradioDeployment[]> {
        const url = `${base}${endpoints.nomadTryMeDeployments}`;
        return this.http.get<GradioDeployment[]>(url);
    }

    deleteDeploymentByUUID(deploymentUUID: string): Observable<StatusReturn> {
        const url = `${base}${endpoints.nomadTryMeDeployment.replace(
            ':deployment_uuid',
            deploymentUUID
        )}`;
        return this.http.delete<StatusReturn>(url, { params: this.voParam });
    }
}
