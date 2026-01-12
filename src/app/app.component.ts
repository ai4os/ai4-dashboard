import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppConfigService } from './core/services/app-config/app-config.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';
import { PlatformStatusService } from './shared/services/platform-status/platform-status.service';
import {
    PlatformStatus,
    StatusNotification,
} from './shared/interfaces/platform-status.interface';
import { SnackbarService } from './shared/services/snackbar/snackbar.service';
import { CookieService } from 'ngx-cookie-service';
import * as yaml from 'js-yaml';
import { ChatOverlayService } from './shared/services/chat-overlay/chat-overlay.service';
import { PopupComponent } from './shared/components/popup/popup.component';
import { AuthService, UserProfile } from './core/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'ai4-dashboard';
    //keep refs to subscriptions to be able to unsubscribe later
    private statusChangeSubscription!: Subscription;

    constructor(
        private titleService: Title,
        private platformStatusService: PlatformStatusService,
        private appConfigService: AppConfigService,
        private chatOverlayService: ChatOverlayService,
        private snackbarService: SnackbarService,
        protected authService: AuthService,
        public translateService: TranslateService,
        public dialog: MatDialog,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private cookieService: CookieService
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    userProfile?: UserProfile;

    addPlausibleScript() {
        const scriptElement = document.getElementById('plausible-script');
        if (!scriptElement) {
            const node = document.createElement('script'); // creates the script tag
            node.id = 'plausible-script';
            node.src = this.appConfigService.analytics['src']; // sets the source (insert url in between quotes)
            node.type = 'text/javascript'; // set the script type
            node.defer = true;
            node.setAttribute(
                'data-domain',
                this.appConfigService.analytics['domain']
            );
            document.getElementsByTagName('head')[0].appendChild(node);
        }
    }

    openPopup(statusNotification: StatusNotification) {
        const width = this.mobileQuery.matches ? '300px' : '650px';
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
        this.dialog.open(PopupComponent, {
            data: {
                icon: 'warning',
                isWarning: true,
                title: statusNotification.title,
                summary: statusNotification.summary,
            },
            width: width,
            maxWidth: width,
            minWidth: width,
            autoFocus: false,
            restoreFocus: false,
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

    checkPlatformStatus() {
        const now = new Date().getTime();
        this.platformStatusService.getPlatformPopup().subscribe({
            next: (status: PlatformStatus[]) => {
                if (status.length > 0) {
                    const popup = this.cookieService.get('statusPopup');
                    if (!popup && status[0].body != null) {
                        const yamlBody = status[0].body
                            .replace(/```yaml/g, '')
                            .replace(/```[\s\S]*/, '');
                        const n: StatusNotification = yaml.load(
                            yamlBody
                        ) as StatusNotification;
                        // filter by vo
                        if (
                            (n.vo !== '' &&
                                n.vo === this.appConfigService.voName) ||
                            n.vo === null
                        ) {
                            // filter by date
                            if (n.start && n.end) {
                                n.start = new Date(n.start);
                                n.end = new Date(n.end);
                                if (
                                    n.start.getTime() <= now &&
                                    n.end.getTime() > now
                                ) {
                                    this.openPopup(n);
                                    this.cookieService.set(
                                        'statusPopup',
                                        'seen'
                                    );
                                }
                            }
                        }
                    }
                }
            },
            error: () => {
                this.snackbarService.openError(
                    "Couldn't update the notifications. Please try again later."
                );
            },
        });
    }

    getHighestAccessLevel(roles: string[]): string {
        const order = ['ap-d', 'ap-u', 'ap-b', 'ap-a1', 'ap-a'];
        let best: string = 'ap-a';
        const voNameEscaped = this.appConfigService.voName.replace(
            /[.*+?^${}()|[\]\\]/g,
            '\\$&'
        );

        roles.forEach((role) => {
            const match = role.match(
                `^access:${voNameEscaped}:(ap-d|ap-u|ap-b|ap-a1|ap-a)$`
            );

            if (match) {
                const level = match[1];
                if (
                    best === null ||
                    order.indexOf(level) < order.indexOf(best)
                ) {
                    best = level;
                }
            }
        });

        return best;
    }

    checkUserRoles() {
        const width = this.mobileQuery.matches ? '300px' : '650px';

        const savedHighestRole = localStorage.getItem('accessLevel') ?? '';
        const currentHighestRole = this.getHighestAccessLevel(
            this.userProfile?.roles || []
        );

        if (
            savedHighestRole === '' ||
            savedHighestRole !== currentHighestRole
        ) {
            localStorage.setItem('accessLevel', currentHighestRole);

            this.translateService
                .get(
                    ['PROFILE.ACCESS-MODAL-TITLE', 'PROFILE.ACCESS-MODAL-BODY'],
                    { currentHighestRole }
                )
                .subscribe((translations) => {
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
                    });
                });
        }
    }

    ngOnInit(): void {
        // get the current profile if it already exists
        const currentProfile = this.authService.userProfileSubject.getValue();
        if (currentProfile) {
            this.userProfile = currentProfile;
            this.checkUserRoles();
        }

        // subscribe to receive future updates
        this.authService.userProfile$.subscribe((profile) => {
            if (profile) {
                this.userProfile = profile;
                this.checkUserRoles();
                this.changeDetectorRef.detectChanges();
            }
        });

        this.titleService.setTitle(this.appConfigService.title);
        this.addPlausibleScript();
        this.checkPlatformStatus();

        if (this.appConfigService.voName !== 'vo.imagine-ai.eu') {
            this.chatOverlayService.openChat();
        }
    }

    ngOnDestroy() {
        // unsubscribe to cookieconsent observables to prevent memory leaks
        this.cookieService.delete('statusPopup');
        this.statusChangeSubscription.unsubscribe();
    }
}
