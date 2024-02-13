import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppConfigService } from './core/services/app-config/app-config.service';
import { Subscription } from 'rxjs';
import {
    NgcCookieConsentService,
    NgcStatusChangeEvent,
} from 'ngx-cookieconsent';

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
        private appConfigService: AppConfigService,
        private cookieService: NgcCookieConsentService
    ) {}

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

    ngOnInit(): void {
        this.titleService.setTitle(this.appConfigService.title);
        this.cookieConsentHandler();
    }

    ngOnDestroy() {
        // unsubscribe to cookieconsent observables to prevent memory leaks
        this.statusChangeSubscription.unsubscribe();
    }
}
