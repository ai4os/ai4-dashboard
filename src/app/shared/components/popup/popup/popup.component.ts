import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HtmlSanitizerService } from '@app/shared/services/html-sanitizer/html-sanitizer.service';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
})
export class PopupComponent {
    constructor(
        public dialogRef: MatDialogRef<PopupComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { title: string; summary: string },
        protected htmlSanitizerService: HtmlSanitizerService
    ) {}
}
