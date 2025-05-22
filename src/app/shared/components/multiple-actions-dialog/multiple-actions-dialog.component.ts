import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-multiple-actions-dialog',
    templateUrl: './multiple-actions-dialog.component.html',
    styleUrl: './multiple-actions-dialog.component.scss',
})
export class MultipleActionsDialogComponent {
    constructor(
        private dialogRef: MatDialogRef<MultipleActionsDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            title: string;
            optionA: string;
            optionB: string;
        }
    ) {}

    onActionA() {
        this.dialogRef.close(this.data.optionA);
    }

    onActionB() {
        this.dialogRef.close(this.data.optionB);
    }
}
