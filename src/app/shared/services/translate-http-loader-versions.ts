import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

declare const VERSION: string;

export class TranslateHttpLoaderVersions implements TranslateLoader {
    constructor(
        private http: HttpClient,
        public prefix: string = '/assets/i18n/',
        public suffix: string = '.json'
    ) {}

    getTranslation(lang: string): Observable<Object> {
        const version = VERSION;
        return this.http.get(
            `${this.prefix}${lang}${this.suffix}?v=${version}`
        );
    }
}
