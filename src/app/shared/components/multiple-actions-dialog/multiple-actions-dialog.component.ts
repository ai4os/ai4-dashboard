import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
} from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-multiple-actions-dialog',
    templateUrl: './multiple-actions-dialog.component.html',
    styleUrl: './multiple-actions-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        MatDialogActions,
        MatButton,
    ],
})
export class MultipleActionsDialogComponent {
    private dialogRef =
        inject<MatDialogRef<MultipleActionsDialogComponent>>(MatDialogRef);
    data = inject<{
        title: string;
        optionA: string;
        optionB: string;
    }>(MAT_DIALOG_DATA);

    onActionA() {
        this.dialogRef.close(this.data.optionA);
    }

    onActionB() {
        this.dialogRef.close(this.data.optionB);
    }
}
