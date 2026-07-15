import {
    ApplicationConfig,
    importProvidersFrom,
    provideAppInitializer,
    provideZoneChangeDetection,
    inject,
} from '@angular/core';

import {
    provideHttpClient,
    withInterceptorsFromDi,
    HTTP_INTERCEPTORS,
} from '@angular/common/http';

import {
    OAuthModule,
    OAuthStorage,
    OAuthModuleConfig,
} from 'angular-oauth2-oidc';

import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';

import { provideMarkdown, MARKED_OPTIONS, MarkedRenderer } from 'ngx-markdown';

import {
    MAT_ICON_DEFAULT_OPTIONS,
    MatIconRegistry,
} from '@angular/material/icon';

import {
    MAT_DATE_LOCALE,
    provideNativeDateAdapter,
} from '@angular/material/core';

import { Title } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';

import { NgxEchartsModule } from 'ngx-echarts';

import { CookieService } from 'ngx-cookie-service';

import { IntroJSService } from '../../introjs/introjs.service';

import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';

import { AppConfigService } from './core/services/app-config/app-config.service';

import { environment } from '@environments/environment';

import { AuthService } from './core/services/auth/auth.service';
import { authAppInitializerFactory } from './core/services/auth/auth-app-initializer.factory';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
    authConfigFactory,
    CustomTranslateLoader,
    storageFactory,
} from './app.providers';
import { Tokens } from 'marked';

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

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),

        importProvidersFrom(
            ReactiveFormsModule,
            OAuthModule.forRoot(),
            NgxEchartsModule.forRoot({
                echarts: () => import('echarts'),
            })
        ),

        provideHttpClient(withInterceptorsFromDi()),

        provideZoneChangeDetection({
            eventCoalescing: true,
        }),

        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true,
        },

        provideNativeDateAdapter(),

        {
            provide: MAT_DATE_LOCALE,
            useValue: 'en-GB',
        },

        {
            provide: MAT_ICON_DEFAULT_OPTIONS,
            useValue: {
                fontSet: 'material-symbols-rounded',
            },
        },

        {
            provide: OAuthStorage,
            useFactory: storageFactory,
        },

        {
            provide: OAuthModuleConfig,
            useFactory: authConfigFactory,
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
                    renderer,
                    gfm: true,
                    breaks: false,
                },
            },
        }),

        AuthService,

        provideAppInitializer(() => {
            const appConfigService = inject(AppConfigService);
            const authConfig = inject(OAuthModuleConfig);

            return appConfigService.loadAppConfig(authConfig).then(() => {
                if (appConfigService.apiURL) {
                    environment.api.base = appConfigService.apiURL;
                }
            });
        }),

        provideAppInitializer(() => {
            const authService = inject(AuthService);
            return authAppInitializerFactory(authService)();
        }),

        provideAppInitializer(() => {
            inject(MatIconRegistry).setDefaultFontSetClass(
                'material-symbols-outlined'
            );
        }),

        Title,
        CookieService,
        IntroJSService,
    ],
};
