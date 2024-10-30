import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
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
        )}`;
        const params = new HttpParams()
            .set('storage_name', storageName)
            .set('vo', this.appConfigService.voName)
            .set('subpath', 'ai4os-storage/tools/cvat/backups');

        return this.http.get<Array<Snapshot>>(url, { params });
    }
}
