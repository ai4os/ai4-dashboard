import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlatformStatus } from '@app/shared/interfaces/platform-status.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PlatformStatusService {
    constructor(private http: HttpClient) {}

    getPlatformPopup(): Observable<PlatformStatus[]> {
        const url =
            'https://api.github.com/repos/AI4EOSC/status/issues?state=open&filter=all&sort=created&direction=desc&labels=dashboard-popup';
        return this.http.get<Array<PlatformStatus>>(url);
    }

    getPlatformNotifications(): Observable<PlatformStatus[]> {
        const url =
            'https://api.github.com/repos/AI4EOSC/status/issues?state=open&filter=all&sort=created&direction=desc&labels=dashboard-notification';
        return this.http.get<Array<PlatformStatus>>(url);
    }
}
