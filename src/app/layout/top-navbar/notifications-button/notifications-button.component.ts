import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import {
    PlatformStatus,
    StatusNotification,
} from '@app/shared/interfaces/platform-status.interface';
import { HtmlSanitizerService } from '@app/shared/services/html-sanitizer/html-sanitizer.service';
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
        protected platformStatusService: PlatformStatusService,
        private snackbarService: SnackbarService,
        protected htmlSanitizerService: HtmlSanitizerService
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
                    this.displayedNotifications =
                        this.platformStatusService.filterByDateAndVo(
                            this.notifications
                        );
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
}
