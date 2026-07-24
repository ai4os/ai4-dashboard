import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '@environments/environment';
import { gitInfo } from '@environments/version';
import { TranslateLoader } from '@ngx-translate/core';
import { OAuthModuleConfig, OAuthStorage } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';

const { base } = environment.api;

export function storageFactory(): OAuthStorage {
    return localStorage;
}

export function authConfigFactory(): OAuthModuleConfig {
    return {
        resourceServer: {
            allowedUrls: [base],
            sendAccessToken: true,
        },
    };
}

export class CustomTranslateLoader implements TranslateLoader {
    private http = inject(HttpClient);

    getTranslation(lang: string): Observable<any> {
        return this.http.get(`./assets/i18n/${lang}.json?v=${gitInfo.version}`);
    }
}
