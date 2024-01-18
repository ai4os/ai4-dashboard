import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';

import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { HttpClientModule } from '@angular/common/http';
import { TopNavbarComponent } from './layout/top-navbar/top-navbar.component';
import { SharedModule } from './shared/shared.module';

import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import {
    NgcCookieConsentModule,
    NgcCookieConsentConfig,
} from 'ngx-cookieconsent';
import { CoreModule } from './core/core.module';
import { environment } from '@environments/environment';
import { MatIconRegistry } from '@angular/material/icon';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { AppConfigService } from './core/services/app-config/app-config.service';

export function storageFactory(): OAuthStorage {
    return localStorage;
}

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
const { base } = environment.api;

const cookieConfig: NgcCookieConsentConfig = {
    cookie: {
        domain: 'not-set-yet', // or 'your.domain.com' // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
    },
    content: {
        link: '',
    },
    palette: {
        popup: {
            background: 'var(--white-three)',
            text: 'var(--primary-text)',
        },
        button: {
            background: '#008792',
        },
    },
    mobileForceFloat: true,
    position: 'bottom-right',
    theme: 'edgeless',
    type: 'opt-out',
};

const renderer = new MarkedRenderer();

renderer.paragraph = (text: string) => {
    if (text.startsWith('&lt;img')) {
        const div = document.createElement('div');
        div.innerHTML = text.trim();
        if (div.firstChild?.textContent != null) {
            return div.firstChild.textContent;
        } else {
            return '';
        }
    } else {
        return '<p>' + text + '</p>';
    }
};

renderer.link = (href, title, text) => {
    if (text.endsWith('/&gt;')) {
        return text;
    } else {
        return '<a href="' + href + '" title="' + title + '">' + text + '</a>';
    }
};

@NgModule({
    declarations: [
        AppComponent,
        ContentLayoutComponent,
        SidenavComponent,
        TopNavbarComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        OAuthModule.forRoot({
            resourceServer: {
                allowedUrls: [base],
                sendAccessToken: true,
            },
        }),
        TranslateModule.forRoot({
            defaultLanguage: 'en',
            useDefaultLang: true,
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),
        BrowserAnimationsModule,
        SharedModule,
        CoreModule,
        MarkdownModule.forRoot({
            markedOptions: {
                provide: MarkedOptions,
                useValue: {
                    renderer: renderer,
                    gfm: true,
                    breaks: false,
                    sanitize: false,
                },
            },
        }),
        NgcCookieConsentModule.forRoot(cookieConfig),
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            multi: true,
            deps: [AppConfigService, NgcCookieConsentConfig],
            useFactory: (
                appConfigService: AppConfigService,
                config: NgcCookieConsentConfig
            ) => {
                return () => {
                    return appConfigService.loadAppConfig().then(() => {
                        if (config.cookie) {
                            config.cookie.domain =
                                appConfigService.analytics.domain;
                        }
                    });
                };
            },
        },
        { provide: OAuthStorage, useFactory: storageFactory },
        Title,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(iconRegistry: MatIconRegistry) {
        iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
    }
}
