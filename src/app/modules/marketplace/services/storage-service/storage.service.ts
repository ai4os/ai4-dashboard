import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { StatusReturn } from '@app/shared/interfaces/deployment.interface';
import { Snapshot } from '@app/shared/interfaces/module.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService
    ) {}

    readonly voParam = new HttpParams().set('vo', this.appConfigService.voName);

    getSnapshots(storageName: string): Observable<Snapshot[]> {
        const url = `${base}${endpoints.snapshots.replace(
            ':storage_name',
            storageName
        )}/ls`;
        const params = new HttpParams()
            .set('storage_name', storageName)
            .set('vo', this.appConfigService.voName)
            .set('subpath', 'ai4os-storage/tools/cvat/backups');
        const headers = new HttpHeaders().set('X-Silent-Error', 'true');

        return this.http.get<Array<Snapshot>>(url, { headers, params });
    }

    deleteSnapshot(
        storageName: string,
        filePath: string
    ): Observable<StatusReturn> {
        const url = `${base}${endpoints.snapshots.replace(
            ':storage_name',
            storageName
        )}/rm`;
        const params = new HttpParams()
            .set('storage_name', storageName)
            .set('vo', this.appConfigService.voName)
            .set('subpath', 'ai4os-storage/tools/cvat/backups/' + filePath);

        return this.http.delete<StatusReturn>(url, { params });
    }
}
