import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogTitle } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-iframe-dialog',
    templateUrl: './iframe-dialog.component.html',
    styleUrl: './iframe-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatDialogTitle, MatIcon, TranslatePipe],
})
export class IframeDialogComponent {
    data = inject<{
        url: string;
    }>(MAT_DIALOG_DATA);
    private sanitizer = inject(DomSanitizer);

    iframeUrl: SafeResourceUrl;

    constructor() {
        const data = this.data;

        this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            data.url
        );
    }
}
