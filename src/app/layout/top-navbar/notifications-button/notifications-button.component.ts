import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import {
    PlatformStatus,
    StatusNotification,
} from '@app/shared/interfaces/platform-status.interface';
import { PlatformStatusService } from '@app/shared/services/platform-status/platform-status.service';

@Component({
    selector: 'app-notifications-button',
    templateUrl: './notifications-button.component.html',
    styleUrls: ['./notifications-button.component.scss'],
})
export class NotificationsButtonComponent implements OnInit {
    constructor(
        private platformStatusService: PlatformStatusService,
        private appConfigService: AppConfigService
    ) {}

    notifications: StatusNotification[] = [];
    displayedNotifications: StatusNotification[] = [];

    ngOnInit(): void {
        this.getNotifications();
    }

    getNotifications() {
        this.platformStatusService.getPlatformNotifications().subscribe({
            next: (platformStatus: PlatformStatus[]) => {
                if (platformStatus.length > 0) {
                    platformStatus.forEach((status) => {
                        if (status.body != null) {
                            const processedStatus = this.parseStatusString(
                                status.body
                            );
                            let notification: StatusNotification = {
                                title: processedStatus.title,
                                summary: processedStatus.summary,
                                vo: processedStatus.vo ?? '',
                                start: processedStatus.start,
                                end: processedStatus.end,
                            };
                            this.notifications.push(notification);
                        } else {
                            let notification: StatusNotification = {
                                title: status.title,
                            };
                            this.notifications.push(notification);
                        }
                    });
                    this.filterByDateAndVo(this.notifications);
                } else {
                    this.notifications = [];
                }
            },
            error: () => {
                this.notifications = [];
            },
        });
    }

    parseStatusString(eventString: string): StatusNotification {
        let eventLines = eventString.trim().split('\n');

        const eventObject: any = {};
        eventLines = eventLines.slice(1, 6);

        eventLines.forEach((line) => {
            const [key, value] = line.split(': ');

            eventObject[key.trim()] = value !== undefined ? value.trim() : '';
        });

        return eventObject;
    }

    filterByDateAndVo(notifications: StatusNotification[]) {
        const now = new Date().getTime();
        notifications.forEach((n) => {
            console.log(n);

            // filter by vo
            if (
                (n.vo !== '' && n.vo === this.appConfigService.voName) ||
                n.vo === ''
            ) {
                // filter by date
                if (n.start && n.end) {
                    n.start = new Date(n.start);
                    n.end = new Date(n.end);
                    if (n.start.getTime() <= now && n.end.getTime() > now) {
                        this.displayedNotifications.push(n);
                    }
                } else {
                    this.displayedNotifications.push(n);
                }
            }
        });
    }
}
