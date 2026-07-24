import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

class FakeTranslateLoader implements TranslateLoader {
    getTranslation(_: string): Observable<Record<string, string>> {
        return of({});
    }
}

export function provideTranslateTesting() {
    return provideTranslateService({
        fallbackLang: 'en',
        loader: {
            provide: TranslateLoader,
            useClass: FakeTranslateLoader,
        },
    });
}
