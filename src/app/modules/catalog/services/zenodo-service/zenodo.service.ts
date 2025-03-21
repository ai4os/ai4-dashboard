import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import {
    ZenodoCommunity,
    ZenodoDataset,
    ZenodoDatasetVersion,
    ZenodoSimpleDataset,
} from '@app/shared/interfaces/dataset.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const { base, endpoints } = environment.api;
const communitiesJsonUrl = '../../../assets/json/zenodo_communities.json';

@Injectable({
    providedIn: 'root',
})
export class ZenodoService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService
    ) {}

    getCommunities(): Observable<ZenodoCommunity[]> {
        return this.http.get<ZenodoCommunity[]>(communitiesJsonUrl);
    }

    getDatasets(communityName: string): Observable<ZenodoDataset[]> {
        const url = `${base}${endpoints.zenodo}`;
        const params = new HttpParams().set(
            'api_route',
            'communities/' + communityName + '/records'
        );
        const body = { q: 'resource_type.type:dataset' };
        return this.http.post<Array<ZenodoDataset>>(url, body, {
            params: params,
        });
    }

    getDatasetVersions(id: string): Observable<ZenodoDatasetVersion[]> {
        const url = `${base}${endpoints.zenodo}`;
        const params = new HttpParams().set(
            'api_route',
            'records/' + id + '/versions'
        );
        const body = {};
        return this.http.post<Array<ZenodoDatasetVersion>>(url, body, {
            params: params,
        });
    }

    getDataset(id: string): Observable<ZenodoSimpleDataset> {
        const url = `${base}${endpoints.zenodo}`;
        const params = new HttpParams().set('api_route', 'records/' + id);
        const body = {};
        return this.http.post<ZenodoSimpleDataset>(url, body, {
            params: params,
        });
    }
}
