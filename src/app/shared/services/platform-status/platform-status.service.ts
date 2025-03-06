import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import {
    PlatformStatus,
    StatusNotification,
} from '@app/shared/interfaces/platform-status.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PlatformStatusService {
    constructor(
        private appConfigService: AppConfigService,
        private http: HttpClient
    ) {}

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

    getNomadClusterNotifications(): Observable<PlatformStatus[]> {
        const url =
            'https://api.github.com/repos/AI4EOSC/status/issues?state=open&filter=all&sort=created&direction=desc&labels=nomad-maintenance';
        return this.http.get<Array<PlatformStatus>>(url);
    }

    /**       UTILS       **/
    filterByDateAndVo(
        notifications: StatusNotification[]
    ): StatusNotification[] {
        const displayedNotifications: StatusNotification[] = [];
        const now = new Date().getTime();
        notifications.forEach((n) => {
            // filter by vo
            if (
                (n.vo !== '' && n.vo === this.appConfigService.voName) ||
                n.vo === null
            ) {
                // filter by date
                if (n.start && n.end) {
                    n.start = new Date(n.start);
                    n.end = new Date(n.end);
                    if (n.start.getTime() <= now && n.end.getTime() > now) {
                        displayedNotifications.push(n);
                    }
                } else {
                    displayedNotifications.push(n);
                }
            }
        });
        return displayedNotifications;
    }
}
