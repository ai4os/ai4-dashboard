import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-api-key-popup',
    templateUrl: './api-key-popup.component.html',
    styleUrl: './api-key-popup.component.scss',
})
export class ApiKeyPopupComponent {
    constructor(
        public dialogRef: MatDialogRef<ApiKeyPopupComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { apiKey: string }
    ) {}
}
