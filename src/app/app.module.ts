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
import { NgxEchartsModule } from 'ngx-echarts';
import { NotificationsButtonComponent } from './layout/top-navbar/notifications-button/notifications-button.component';
import { CookieService } from 'ngx-cookie-service';
import { gitInfo } from '@environments/version';

export function storageFactory(): OAuthStorage {
    return localStorage;
}

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(
        http,
        './assets/i18n/',
        '.json?v=' + gitInfo.version
    );
}
const { base } = environment.api;

const cookieConfig: NgcCookieConsentConfig = {
    cookie: {
        domain: 'not-set-yet', // or 'your.domain.com' // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
    },
    content: {
        message:
            'This platform uses cookies to ensure you get the best experience using it.',
        link: 'Learn more',
        href: 'not-set-yet',
    },
    palette: {
        popup: {
            background: 'var(--white-three)',
            text: 'var(--primary-text)',
        },
        button: {
            background: 'var(--accent)',
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
        NotificationsButtonComponent,
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
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts'),
        }),
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
                            config.content!.href =
                                appConfigService.legalLinks[1].url;
                        }
                    });
                };
            },
        },
        { provide: OAuthStorage, useFactory: storageFactory },
        Title,
        CookieService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(iconRegistry: MatIconRegistry) {
        iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
    }
}
