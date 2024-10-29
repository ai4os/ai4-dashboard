import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import {
    PlatformStatus,
    StatusNotification,
} from '@app/shared/interfaces/platform-status.interface';
import { PlatformStatusService } from '@app/shared/services/platform-status/platform-status.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import * as yaml from 'js-yaml';

@Component({
    selector: 'app-notifications-button',
    templateUrl: './notifications-button.component.html',
    styleUrls: ['./notifications-button.component.scss'],
})
export class NotificationsButtonComponent implements OnInit {
    constructor(
        private platformStatusService: PlatformStatusService,
        private appConfigService: AppConfigService,
        private snackbarService: SnackbarService
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
                            const yamlBody = status.body
                                .replace(/```yaml/g, '')
                                .replace(/```[\s\S]*/, '');
                            const notification: StatusNotification = yaml.load(
                                yamlBody
                            ) as StatusNotification;
                            this.notifications.push(notification);
                        } else {
                            const notification: StatusNotification = {
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
                this.snackbarService.openError(
                    'Error retrieving the platform notifications'
                );
            },
        });
    }

    filterByDateAndVo(notifications: StatusNotification[]) {
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
                        this.displayedNotifications.push(n);
                    }
                } else {
                    this.displayedNotifications.push(n);
                }
            }
        });
    }
}
