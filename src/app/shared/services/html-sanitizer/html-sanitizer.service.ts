import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root',
})
export class HtmlSanitizerService {
    constructor(private sanitizer: DomSanitizer) {}

    getSanitizedText(html: string): SafeHtml {
        let cleanText = html.replace(
            /<(?!\/?(a|b|i|strong|em)(?=>|\s.*>))\/?.*?>/gi,
            ''
        );
        return this.sanitizer.bypassSecurityTrustHtml(cleanText);
    }
}
