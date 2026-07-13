import {
    HttpClient,
    HTTP_INTERCEPTORS,
    provideHttpClient,
    withInterceptorsFromDi,
} from '@angular/common/http';
import {
    NgModule,
    provideAppInitializer,
    inject,
    provideZoneChangeDetection,
    Injectable,
} from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import {
    OAuthModule,
    OAuthStorage,
    OAuthModuleConfig,
} from 'angular-oauth2-oidc';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { provideMarkdown, MARKED_OPTIONS, MarkedRenderer } from 'ngx-markdown';
import { Observable } from 'rxjs';

import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { TopNavbarComponent } from './layout/top-navbar/top-navbar.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { environment } from '@environments/environment';
import {
    MAT_ICON_DEFAULT_OPTIONS,
    MatIconRegistry,
} from '@angular/material/icon';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { AppConfigService } from './core/services/app-config/app-config.service';
import { NgxEchartsModule } from 'ngx-echarts';
import { NotificationsButtonComponent } from './layout/top-navbar/notifications-button/notifications-button.component';
import { CookieService } from 'ngx-cookie-service';
import { gitInfo } from '@environments/version';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { FooterComponent } from './layout/footer/footer.component';
import { Tokens } from 'marked';
import { IntroJSService } from '../../introjs/introjs.service';

export function storageFactory(): OAuthStorage {
    return localStorage;
}

@Injectable({ providedIn: 'root' })
export class CustomTranslateLoader implements TranslateLoader {
    constructor(private http: HttpClient) {}

    getTranslation(lang: string): Observable<any> {
        return this.http.get(`./assets/i18n/${lang}.json?v=${gitInfo.version}`);
    }
}

export function authConfigFactory(): OAuthModuleConfig {
    return {
        resourceServer: {
            allowedUrls: [base],
            sendAccessToken: true,
        },
    };
}

const { base } = environment.api;

const renderer = new MarkedRenderer();

renderer.paragraph = (token: Tokens.Paragraph) => {
    const text = token.text;

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

renderer.link = (token: Tokens.Link) => {
    const href = token.href;
    const title = token.title || '';
    const text = token.text;

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
        FooterComponent,
        TopNavbarComponent,
        NotificationsButtonComponent,
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        OAuthModule.forRoot(),
        SharedModule,
        CoreModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts'),
        }),
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        {
            provide: MAT_ICON_DEFAULT_OPTIONS,
            useValue: { fontSet: 'material-symbols-rounded' },
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true,
        },
        provideTranslateService({
            fallbackLang: 'en',
            loader: {
                provide: TranslateLoader,
                useClass: CustomTranslateLoader,
            },
        }),
        provideMarkdown({
            markedOptions: {
                provide: MARKED_OPTIONS,
                useValue: {
                    renderer: renderer,
                    gfm: true,
                    breaks: false,
                },
            },
        }),
        provideAppInitializer(() => {
            const appConfigService = inject(AppConfigService);
            const authConfig = inject(OAuthModuleConfig);

            return appConfigService.loadAppConfig(authConfig).then(() => {
                if (appConfigService.apiURL && appConfigService.apiURL !== '') {
                    environment.api.base = appConfigService.apiURL;
                }
            });
        }),
        { provide: OAuthStorage, useFactory: storageFactory },
        {
            provide: OAuthModuleConfig,
            useFactory: authConfigFactory,
        },
        Title,
        CookieService,
        IntroJSService,
        provideHttpClient(withInterceptorsFromDi()),
        provideZoneChangeDetection({ eventCoalescing: true }),
    ],
})
export class AppModule {
    constructor(iconRegistry: MatIconRegistry) {
        iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
    }
}
