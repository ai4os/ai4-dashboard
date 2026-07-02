import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-api-key-popup',
    templateUrl: './api-key-popup.component.html',
    styleUrl: './api-key-popup.component.scss',
})
export class ApiKeyPopupComponent {
    constructor(
        public dialog: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { key: string }
    ) {}

    closeDialog(): void {
        this.dialog.close(false);
    }
}
