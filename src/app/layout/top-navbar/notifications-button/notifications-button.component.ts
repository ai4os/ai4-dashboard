import { Component, inject, OnInit, signal } from '@angular/core';
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
    protected platformStatusService = inject(PlatformStatusService);
    protected htmlSanitizerService = inject(HtmlSanitizerService);
    private snackbarService = inject(SnackbarService);

    protected displayedNotifications = signal<StatusNotification[]>([]);

    ngOnInit(): void {
        this.getNotifications();
    }

    private getNotifications(): void {
        this.platformStatusService.getPlatformNotifications().subscribe({
            next: (platformStatus: PlatformStatus[]) => {
                if (platformStatus.length === 0) {
                    this.displayedNotifications.set([]);
                    return;
                }

                const parsedNotifications: StatusNotification[] =
                    platformStatus.map((status) => {
                        if (status.body != null) {
                            const yamlBody = status.body
                                .replace(/```yaml/g, '')
                                .replace(/```[\s\S]*/, '');
                            return yaml.load(yamlBody) as StatusNotification;
                        }
                        return { title: status.title } as StatusNotification;
                    });

                const filtered =
                    this.platformStatusService.filterByDateAndVo(
                        parsedNotifications
                    );
                this.displayedNotifications.set(filtered);
            },
            error: () => {
                this.displayedNotifications.set([]);
                this.snackbarService.openError(
                    'Error retrieving the platform notifications'
                );
            },
        });
    }
}
