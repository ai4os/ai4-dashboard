import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { UiButtonComponent } from '../ui/ui-button/ui-button.component';
import { TranslatePipe } from '@ngx-translate/core';

export interface MultipleActionsDialogData {
    title: string;
    subtitle: string;
    optionA: string;
    optionB: string;
    icon?: string;
    showCloseButton?: boolean;
}

@Component({
    selector: 'app-multiple-actions-dialog',
    templateUrl: './multiple-actions-dialog.component.html',
    styleUrl: './multiple-actions-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatIcon,
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        MatDialogActions,
        UiButtonComponent,
        TranslatePipe,
    ],
})
export class MultipleActionsDialogComponent {
    private readonly dialogRef =
        inject<MatDialogRef<MultipleActionsDialogComponent>>(MatDialogRef);
    data = inject<MultipleActionsDialogData>(MAT_DIALOG_DATA);

    icon?: string;
    showCloseButton: boolean;

    constructor() {
        this.icon = this.data.icon;
        this.showCloseButton = this.data.showCloseButton ?? false;
    }

    close(): void {
        this.dialogRef.close();
    }

    onActionA(): void {
        this.dialogRef.close(this.data.optionA);
    }

    onActionB(): void {
        this.dialogRef.close(this.data.optionB);
    }
}
