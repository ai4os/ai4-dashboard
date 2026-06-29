import { Component, Inject, Optional } from '@angular/core';
import {
    MAT_SNACK_BAR_DATA,
    MatSnackBarRef,
} from '@angular/material/snack-bar';

export type UiSnackbarVariant = 'primary' | 'accent' | 'success' | 'danger';

export interface UiSnackbarData {
    text: string;
    variant: UiSnackbarVariant;
    icon?: string;
    dismissible?: boolean;
}

const DEFAULT_ICON: Record<UiSnackbarVariant, string> = {
    primary: 'info',
    accent: 'info',
    success: 'check_circle',
    danger: 'error',
};

@Component({
    selector: 'app-ui-snackbar',
    templateUrl: './ui-snackbar.component.html',
    styleUrls: ['./ui-snackbar.component.scss'],
})
export class UiSnackbarComponent {
    constructor(
        @Optional() private snackBarRef: MatSnackBarRef<UiSnackbarComponent>,
        @Optional() @Inject(MAT_SNACK_BAR_DATA) public data: UiSnackbarData
    ) {}

    get icon(): string {
        return this.data.icon ?? DEFAULT_ICON[this.data.variant];
    }

    dismiss(): void {
        this.snackBarRef?.dismiss();
    }
}
