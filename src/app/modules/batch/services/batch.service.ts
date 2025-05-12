import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import {
    Deployment,
    StatusReturn,
} from '@app/shared/interfaces/deployment.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class BatchService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService
    ) {}

    readonly voParam = new HttpParams().set('vo', this.appConfigService.voName);
    readonly vosArrayParam = new HttpParams().set(
        'vos',
        this.appConfigService.voName
    );

    getBatchDeployments(): Observable<Deployment[]> {
        const url = `${base}${endpoints.batchDeployments}`;

        return this.http.get<Array<Deployment>>(url, {
            params: this.vosArrayParam,
        });
    }

    getBatchDeploymentByUUID(deploymentUUID: string): Observable<Deployment> {
        const url = `${base}${endpoints.batchDeploymentsByUUID.replace(
            ':deploymentUUID',
            deploymentUUID
        )}`;
        return this.http.get<Deployment>(url, { params: this.voParam });
    }

    deleteBatchDeploymentByUUID(
        deploymentUUID: string
    ): Observable<StatusReturn> {
        const url = `${base}${endpoints.batchDeploymentsByUUID.replace(
            ':deploymentUUID',
            deploymentUUID
        )}`;
        return this.http.delete<StatusReturn>(url, { params: this.voParam });
    }
}
