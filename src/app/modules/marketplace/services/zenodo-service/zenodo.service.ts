import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { ZenodoDataset } from '@app/shared/interfaces/dataset.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class ZenodoService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService
    ) {}

    getDatasets(): Observable<ZenodoDataset[]> {
        const url = `${base}${endpoints.zenodo}`;
        const community =
            this.appConfigService.voName == 'vo.imagine-ai.eu'
                ? 'imagine-project'
                : 'ai4eosc';
        const params = new HttpParams().set(
            'api_route',
            'communities/' + community + '/records'
        );
        const body = { q: 'resource_type.type:dataset' };
        return this.http.post<Array<ZenodoDataset>>(url, body, {
            params: params,
        });
    }
}
