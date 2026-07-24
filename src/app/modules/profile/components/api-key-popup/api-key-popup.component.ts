import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { UiCredentialRowComponent } from '../../../../shared/components/ui/ui-credential-row/ui-credential-row.component';
import { UiButtonComponent } from '../../../../shared/components/ui/ui-button/ui-button.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-api-key-popup',
    templateUrl: './api-key-popup.component.html',
    styleUrl: './api-key-popup.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatIcon,
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        UiCredentialRowComponent,
        MatDialogActions,
        UiButtonComponent,
        TranslatePipe,
    ],
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
