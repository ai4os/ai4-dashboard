import {
    Component,
    ElementRef,
    HostListener,
    OnInit,
    inject,
    signal,
    ChangeDetectionStrategy,
} from '@angular/core';
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
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class NotificationsButtonComponent implements OnInit {
    protected platformStatusService = inject(PlatformStatusService);
    protected htmlSanitizerService = inject(HtmlSanitizerService);
    private snackbarService = inject(SnackbarService);
    private elementRef = inject(ElementRef);

    protected displayedNotifications = signal<StatusNotification[]>([]);
    protected isOpen = signal(false);
    protected expandedTitles = signal<Set<string>>(new Set());

    ngOnInit(): void {
        this.getNotifications();
    }

    protected toggleMenu(): void {
        this.isOpen.update((open) => !open);
    }

    protected closeMenu(): void {
        this.isOpen.set(false);
    }

    protected isExpanded(title: string): boolean {
        return this.expandedTitles().has(title);
    }

    protected onExpandedChange(title: string, expanded: boolean): void {
        this.expandedTitles.update((titles) => {
            const next = new Set(titles);
            if (expanded) {
                next.add(title);
            } else {
                next.delete(title);
            }
            return next;
        });
    }

    @HostListener('document:click', ['$event'])
    protected onDocumentClick(event: MouseEvent): void {
        if (!this.isOpen()) {
            return;
        }
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.closeMenu();
        }
    }

    @HostListener('document:keydown.escape')
    protected onEscapeKey(): void {
        this.closeMenu();
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
