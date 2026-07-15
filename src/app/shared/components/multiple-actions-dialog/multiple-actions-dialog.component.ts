import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-multiple-actions-dialog',
    templateUrl: './multiple-actions-dialog.component.html',
    styleUrl: './multiple-actions-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
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
