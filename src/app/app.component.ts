import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    OnInit,
    inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import * as yaml from 'js-yaml';
import { filter } from 'rxjs';

import { AppConfigService } from './core/services/app-config/app-config.service';
import { PlatformStatusService } from './shared/services/platform-status/platform-status.service';
import {
    PlatformStatus,
    StatusNotification,
} from './shared/interfaces/platform-status.interface';
import { SnackbarService } from './shared/services/snackbar/snackbar.service';
import { ChatOverlayService } from './shared/services/chat-overlay/chat-overlay.service';
import { PopupComponent } from './shared/components/popup/popup.component';
import { AuthService, UserProfile } from './core/services/auth/auth.service';

const MOBILE_BREAKPOINT_QUERY = '(max-width: 650px)';
const DIALOG_WIDTH_MOBILE = '300px';
const DIALOG_WIDTH_DESKTOP = '650px';
const ACCESS_LEVEL_STORAGE_KEY = 'accessLevel';
const STATUS_POPUP_COOKIE = 'statusPopup';

// + privilegio a - privilegio
const ACCESS_LEVEL_ORDER = [
    'ap-d',
    'ap-u',
    'ap-b',
    'ap-a1',
    'ap-a',
    'ap-0',
] as const;
type AccessLevel = (typeof ACCESS_LEVEL_ORDER)[number];

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
    title = 'ai4-dashboard';

    private readonly titleService = inject(Title);
    private readonly platformStatusService = inject(PlatformStatusService);
    private readonly appConfigService = inject(AppConfigService);
    private readonly chatOverlayService = inject(ChatOverlayService);
    private readonly snackbarService = inject(SnackbarService);
    private readonly authService = inject(AuthService);
    private readonly translateService = inject(TranslateService);
    private readonly dialog = inject(MatDialog);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private readonly media = inject(MediaMatcher);
    private readonly cookieService = inject(CookieService);
    private readonly destroyRef = inject(DestroyRef);

    readonly mobileQuery: MediaQueryList = this.media.matchMedia(
        MOBILE_BREAKPOINT_QUERY
    );
    private readonly mobileQueryListener = () =>
        this.changeDetectorRef.detectChanges();

    userProfile?: UserProfile;

    constructor() {
        this.mobileQuery.addEventListener('change', this.mobileQueryListener);
        this.destroyRef.onDestroy(() => {
            this.mobileQuery.removeEventListener(
                'change',
                this.mobileQueryListener
            );
            this.cookieService.delete(STATUS_POPUP_COOKIE);
        });
    }

    ngOnInit(): void {
        this.titleService.setTitle(this.appConfigService.title);
        this.addPlausibleScript();
        this.checkPlatformStatus();
        this.watchUserProfile();
        this.maybeOpenChat();
    }

    private watchUserProfile(): void {
        this.authService.userProfile$
            .pipe(
                filter((profile): profile is UserProfile => !!profile),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((profile) => {
                this.userProfile = profile;
                this.checkUserRoles();
                this.changeDetectorRef.detectChanges();
            });
    }

    private maybeOpenChat(): void {
        if (this.appConfigService.voName !== 'vo.imagine-ai.eu') {
            /* TODO: enable chat when Milvus problem is solved */
            // this.chatOverlayService.openChat();
        }
    }

    private addPlausibleScript(): void {
        if (document.getElementById('plausible-script')) {
            return;
        }
        const script = document.createElement('script');
        script.id = 'plausible-script';
        script.src = this.appConfigService.analytics['src'];
        script.type = 'text/javascript';
        script.defer = true;
        script.setAttribute(
            'data-domain',
            this.appConfigService.analytics['domain']
        );
        document.head.appendChild(script);
    }

    private dialogWidth(): string {
        return this.mobileQuery.matches
            ? DIALOG_WIDTH_MOBILE
            : DIALOG_WIDTH_DESKTOP;
    }

    private openStatusPopup(statusNotification: StatusNotification): void {
        if (
            statusNotification.downtimeStart &&
            statusNotification.downtimeEnd &&
            statusNotification.datacenters
        ) {
            statusNotification.summary = statusNotification.summary?.concat(
                this.platformStatusService.getMaintenanceInfo(
                    statusNotification
                )
            );
        }

        const width = this.dialogWidth();
        this.dialog.open(PopupComponent, {
            data: {
                icon: 'warning',
                isWarning: true,
                title: statusNotification.title,
                summary: statusNotification.summary,
            },
            width,
            maxWidth: width,
            minWidth: width,
            autoFocus: false,
            restoreFocus: false,
        });
    }

    private checkPlatformStatus(): void {
        const now = Date.now();
        this.platformStatusService
            .getPlatformPopup()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (statuses: PlatformStatus[]) => {
                    const [latest] = statuses;
                    if (
                        !latest?.body ||
                        this.cookieService.get(STATUS_POPUP_COOKIE)
                    ) {
                        return;
                    }

                    const yamlBody = latest.body
                        .replace(/```yaml/g, '')
                        .replace(/```[\s\S]*/, '');
                    const notification = yaml.load(
                        yamlBody
                    ) as StatusNotification;

                    const matchesVo =
                        notification.vo === null ||
                        (notification.vo !== '' &&
                            notification.vo === this.appConfigService.voName);

                    if (
                        !matchesVo ||
                        !notification.start ||
                        !notification.end
                    ) {
                        return;
                    }

                    const start = new Date(notification.start).getTime();
                    const end = new Date(notification.end).getTime();
                    if (start <= now && end > now) {
                        this.openStatusPopup(notification);
                        this.cookieService.set(STATUS_POPUP_COOKIE, 'seen');
                    }
                },
                error: () => {
                    this.snackbarService.openError(
                        "Couldn't update the notifications. Please try again later."
                    );
                },
            });
    }

    private getHighestAccessLevel(roles: string[]): AccessLevel {
        const voNameEscaped = this.appConfigService.voName.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&'
        );
        const pattern = new RegExp(
            `^access:${voNameEscaped}:(ap-d|ap-u|ap-b|ap-a1|ap-a)$`
        );

        let best: AccessLevel = 'ap-0';
        for (const role of roles) {
            const match = role.match(pattern);
            if (match) {
                const level = match[1] as AccessLevel;
                if (
                    ACCESS_LEVEL_ORDER.indexOf(level) <
                    ACCESS_LEVEL_ORDER.indexOf(best)
                ) {
                    best = level;
                }
            }
        }
        return best;
    }

    private checkUserRoles(): void {
        const savedHighestRole =
            localStorage.getItem(ACCESS_LEVEL_STORAGE_KEY) ?? '';
        const currentHighestRole = this.getHighestAccessLevel(
            this.userProfile?.roles ?? []
        );

        if (savedHighestRole === currentHighestRole) {
            return;
        }
        localStorage.setItem(ACCESS_LEVEL_STORAGE_KEY, currentHighestRole);

        this.translateService
            .get(['PROFILE.ACCESS-MODAL-TITLE', 'PROFILE.ACCESS-MODAL-BODY'], {
                currentHighestRole,
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((translations) => {
                const width = this.dialogWidth();
                this.dialog.open(PopupComponent, {
                    data: {
                        icon: 'identity_platform',
                        isWarning: false,
                        title: translations['PROFILE.ACCESS-MODAL-TITLE'],
                        summary: translations['PROFILE.ACCESS-MODAL-BODY'],
                    },
                    width,
                    maxWidth: width,
                    minWidth: width,
                    autoFocus: false,
                    restoreFocus: false,
                    panelClass: 'ui-dialog-panel',
                });
            });
    }
}
