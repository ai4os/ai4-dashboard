import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-iframe-dialog',
    templateUrl: './iframe-dialog.component.html',
    styleUrl: './iframe-dialog.component.scss',
})
export class IframeDialogComponent {
    iframeUrl: SafeResourceUrl;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { url: string },
        private sanitizer: DomSanitizer
    ) {
        this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            data.url
        );
    }
}
