import { inject, Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root',
})
export class HtmlSanitizerService {
    sanitizer = inject(DomSanitizer);

    getSanitizedText(html: string): SafeHtml {
        const cleanText = html.replace(
            /<(?!\/?(a|b|i|strong|em)(?=>|\s.*>))\/?.*?>/gi,
            ''
        );
        return this.sanitizer.bypassSecurityTrustHtml(cleanText);
    }
}
