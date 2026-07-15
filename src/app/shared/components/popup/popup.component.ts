import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HtmlSanitizerService } from '@app/shared/services/html-sanitizer/html-sanitizer.service';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class PopupComponent {
    dialogRef = inject<MatDialogRef<PopupComponent>>(MatDialogRef);
    data = inject<{
        title: string;
        summary: string;
        icon: string;
        isWarning: boolean;
    }>(MAT_DIALOG_DATA);
    protected htmlSanitizerService = inject(HtmlSanitizerService);
}
