import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
} from '@angular/material/dialog';
import { HtmlSanitizerService } from '@app/shared/services/html-sanitizer/html-sanitizer.service';
import { MatIcon } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatDialogTitle,
        MatIcon,
        NgClass,
        CdkScrollable,
        MatDialogContent,
        MatDialogActions,
        MatButton,
        MatDialogClose,
    ],
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
