import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import {
    ClusterStats,
    UserStats,
} from '@app/shared/interfaces/stats.interface';
import { environment } from '@environments/environment';
import { Observable, of } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class StatsService {
    constructor(
        private http: HttpClient,
        private appConfigService: AppConfigService
    ) {}

    readonly voParam = new HttpParams().set('vo', this.appConfigService.voName);

    getUserStats(): Observable<UserStats> {
        const url = `${base}${endpoints.userStats}`;
        return this.http.get<UserStats>(url, {
            params: this.voParam,
        });
    }

    getClusterStats(): Observable<ClusterStats> {
        const url = `${base}${endpoints.clusterStats}`;
        return this.http.get<ClusterStats>(url);
    }
}
