import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { PlatformStatus } from '@app/shared/interfaces/platform-status.interface';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

const { base, endpoints } = environment.api;

@Injectable({
    providedIn: 'root',
})
export class PlatformStatusService {
    constructor(private http: HttpClient) {}

    getPlatformStatus(): Observable<PlatformStatus[]> {
        const url =
            'https://api.github.com/repos/AI4EOSC/status/issues?state=open&filter=all&sort=created&direction=desc&labels=dashboard-popup';
        return this.http.get<Array<PlatformStatus>>(url);
    }
}
