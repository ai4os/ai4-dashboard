import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import {
    Deployment,
    StatusReturn,
} from '@app/shared/interfaces/deployment.interface';
import { TrainModuleRequest } from '@app/shared/interfaces/module.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class DeploymentsService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService
    ) {}

    readonly voParam = new HttpParams().set('vo', this.appConfigService.voName);
    readonly vosArrayParam = new HttpParams().set(
        'vos',
        this.appConfigService.voName
    );

    getDeployments(): Observable<Deployment[]> {
        const url = `${base}${endpoints.deployments}`;
        return this.http.get<Array<Deployment>>(url, {
            params: this.vosArrayParam,
        });
    }

    getDeploymentByUUID(deploymentUUID: string): Observable<Deployment> {
        const url = `${base}${endpoints.deploymentByUUID.replace(
            ':deploymentUUID',
            deploymentUUID
        )}`;
        return this.http.get<Deployment>(url, { params: this.voParam });
    }

    getToolByUUID(deploymentUUID: string): Observable<Deployment> {
        const url = `${base}${endpoints.toolByUUID.replace(
            ':deploymentUUID',
            deploymentUUID
        )}`;
        return this.http.get<Deployment>(url, { params: this.voParam });
    }

    postTrainModule(moduleConf: TrainModuleRequest): Observable<StatusReturn> {
        const url = `${base}${endpoints.trainModule}`;
        return this.http.post<StatusReturn>(url, moduleConf, {
            params: this.voParam,
        });
    }

    postBatchDeployment(
        moduleConf: TrainModuleRequest,
        batchFile: File
    ): Observable<StatusReturn> {
        const url = `${base}${endpoints.batchDeployments}`;
        const formData = new FormData();
        formData.append('user_cmd', batchFile);
        formData.append('conf', JSON.stringify(moduleConf));

        return this.http.post<StatusReturn>(url, formData, {
            params: this.voParam,
        });
    }

    trainTool(
        toolName: string,
        moduleConf: TrainModuleRequest
    ): Observable<StatusReturn> {
        const url = `${base}${endpoints.trainTool}`;
        const params = new HttpParams()
            .set('vo', this.appConfigService.voName)
            .set('tool_name', toolName);
        return this.http.post<StatusReturn>(url, moduleConf, {
            params: params,
        });
    }

    getTools(): Observable<Deployment[]> {
        const url = `${base}${endpoints.tools}`;
        return this.http.get<Array<Deployment>>(url, {
            params: this.vosArrayParam,
        });
    }

    deleteDeploymentByUUID(deploymentUUID: string): Observable<StatusReturn> {
        const url = `${base}${endpoints.deploymentByUUID.replace(
            ':deploymentUUID',
            deploymentUUID
        )}`;
        return this.http.delete<StatusReturn>(url, { params: this.voParam });
    }

    deleteToolByUUID(deploymentUUID: string): Observable<StatusReturn> {
        const url = `${base}${endpoints.toolByUUID.replace(
            ':deploymentUUID',
            deploymentUUID
        )}`;
        return this.http.delete<StatusReturn>(url, { params: this.voParam });
    }
}
