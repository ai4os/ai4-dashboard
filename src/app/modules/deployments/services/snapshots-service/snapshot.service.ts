import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { Snapshot } from '@app/shared/interfaces/deployment.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const { base, endpoints } = environment.api;

export interface StatusReturnSnapshot {
    status: string;
    snapshot_ID: string;
}

@Injectable({
    providedIn: 'root',
})
export class SnapshotService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService
    ) {}

    readonly voParam = new HttpParams().set('vo', this.appConfigService.voName);

    createSnapshot(deploymentUUID: string): Observable<StatusReturnSnapshot> {
        const url = `${base}${endpoints.deploymentSnapshots}`;
        const params = new HttpParams()
            .set('vo', this.appConfigService.voName)
            .set('deployment_uuid', deploymentUUID);
        const body = {};

        return this.http.post<StatusReturnSnapshot>(url, body, {
            params: params,
        });
    }

    getSnapshots(): Observable<Snapshot[]> {
        const url = `${base}${endpoints.deploymentSnapshots}`;
        return this.http.get<Array<Snapshot>>(url, {
            params: this.voParam,
        });
    }
}
