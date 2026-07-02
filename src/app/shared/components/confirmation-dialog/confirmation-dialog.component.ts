import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmationDialogData {
    title: string;
    subtitlePrefix?: string;
    subtitleHighlight?: string;
    subtitleSuffix?: string;
    showCloseButton?: boolean;
    optionA?: string;
    optionB?: string;
    icon?: string;
}

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
    title: string;
    subtitlePrefix?: string;
    subtitleHighlight?: string;
    subtitleSuffix?: string;
    showCloseButton?: boolean;
    optionA: string;
    optionB: string;
    icon: string;

    constructor(
        public dialog: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
    ) {
        this.title = data.title;
        this.subtitlePrefix = data.subtitlePrefix;
        this.subtitleHighlight = data.subtitleHighlight;
        this.subtitleSuffix = data.subtitleSuffix;
        this.showCloseButton = data.showCloseButton ?? false;
        this.optionA = data.optionA ?? 'No';
        this.optionB = data.optionB ?? 'Yes';
        this.icon = data.icon ?? 'warning';
    }

    get hasSubtitle(): boolean {
        return !!(
            this.subtitlePrefix ||
            this.subtitleHighlight ||
            this.subtitleSuffix
        );
    }

    closeDialog(): void {
        this.dialog.close(false);
    }

    confirm(): void {
        this.dialog.close(true);
    }
}
