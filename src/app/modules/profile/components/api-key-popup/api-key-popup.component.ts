import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-api-key-popup',
    templateUrl: './api-key-popup.component.html',
    styleUrl: './api-key-popup.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class ApiKeyPopupComponent {
    dialog = inject<MatDialogRef<ConfirmationDialogComponent>>(MatDialogRef);
    data = inject<{
        key: string;
    }>(MAT_DIALOG_DATA);

    closeDialog(): void {
        this.dialog.close(false);
    }
}
