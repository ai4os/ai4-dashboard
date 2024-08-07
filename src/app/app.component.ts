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
        private cookieService: NgcCookieConsentService,
        public dialog: MatDialog,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 650px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    cookieConsentHandler() {
        // Check if the "cookieconsent_status" cookie is set to allow, needed for loading the script after reloading the page
        if (this.cookieService.hasConsented()) {
            this.addPlausibleScript();
        }
        this.statusChangeSubscription =
            this.cookieService.statusChange$.subscribe(
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

    openPopup(message: string) {
        const width = this.mobileQuery.matches ? '300px' : '650px';
        this.dialog.open(PopupComponent, {
            data: { message: message },
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

        this.platformStatusService
            .getPlatformPopup()
            .subscribe((status: PlatformStatus[]) => {
                if (status.length > 0) {
                    const popup = localStorage.getItem('statusPopup');
                    if (!popup && status[0].body != null) {
                        const processedStatus = this.parseStatusString(
                            status[0].body
                        );
                        const n: StatusNotification = {
                            title: processedStatus.title,
                            summary: processedStatus.summary,
                            vo: processedStatus.vo ?? '',
                            start: processedStatus.start,
                            end: processedStatus.end,
                        };
                        // filter by vo
                        if (
                            (n.vo !== '' &&
                                n.vo === this.appConfigService.voName) ||
                            n.vo === ''
                        ) {
                            // filter by date
                            if (n.start && n.end) {
                                n.start = new Date(n.start);
                                n.end = new Date(n.end);
                                if (
                                    n.start.getTime() <= now &&
                                    n.end.getTime() > now
                                ) {
                                    this.openPopup(status[0].title);
                                    localStorage.setItem('statusPopup', 'seen');
                                }
                            }
                        }
                    }
                }
            });
    }

    ngOnInit(): void {
        this.titleService.setTitle(this.appConfigService.title);
        this.cookieConsentHandler();
        this.checkPlatformStatus();
    }

    ngOnDestroy() {
        // unsubscribe to cookieconsent observables to prevent memory leaks
        localStorage.removeItem('statusPopup');
        this.statusChangeSubscription.unsubscribe();
    }
}
