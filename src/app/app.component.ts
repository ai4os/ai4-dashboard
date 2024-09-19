import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppConfigService } from './core/services/app-config/app-config.service';
import { Subscription } from 'rxjs';
import {
    NgcCookieConsentService,
    NgcStatusChangeEvent,
} from 'ngx-cookieconsent';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from './shared/components/popup/popup/popup.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { PlatformStatusService } from './shared/services/platform-status/platform-status.service';
import {
    PlatformStatus,
    StatusNotification,
} from './shared/interfaces/platform-status.interface';
import { SnackbarService } from './shared/services/snackbar/snackbar.service';
import { CookieService } from 'ngx-cookie-service';
import * as yaml from 'js-yaml';

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
        private cookieConsentService: NgcCookieConsentService,
        private snackbarService: SnackbarService,
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

    cookieConsentHandler() {
        // Check if the "cookieconsent_status" cookie is set to allow, needed for loading the script after reloading the page
        if (this.cookieConsentService.hasConsented()) {
            this.addPlausibleScript();
        }
        this.statusChangeSubscription =
            this.cookieConsentService.statusChange$.subscribe(
                (event: NgcStatusChangeEvent) => {
                    if (event.status == 'allow' || event.status == 'dismiss') {
                        this.addPlausibleScript();
                    } else if (event.status == 'deny') {
                        this.removePlausibleScript();
                    }
                }
            );
    }

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

    removePlausibleScript() {
        const scriptElement = document.getElementById('plausible-script');
        scriptElement?.parentElement?.removeChild(scriptElement);
    }

    openPopup(statusNotification: StatusNotification) {
        const width = this.mobileQuery.matches ? '300px' : '650px';
        this.dialog.open(PopupComponent, {
            data: {
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
                    'Error updating the platform status'
                );
            },
        });
    }

    ngOnInit(): void {
        this.titleService.setTitle(this.appConfigService.title);
        this.cookieConsentHandler();
        this.checkPlatformStatus();
    }

    ngOnDestroy() {
        // unsubscribe to cookieconsent observables to prevent memory leaks
        this.cookieService.delete('statusPopup');
        this.statusChangeSubscription.unsubscribe();
    }
}
