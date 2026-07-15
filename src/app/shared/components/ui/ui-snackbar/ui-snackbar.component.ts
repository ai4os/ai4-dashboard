import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
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
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class UiSnackbarComponent {
    private snackBarRef = inject<MatSnackBarRef<UiSnackbarComponent>>(
        MatSnackBarRef,
        { optional: true }
    );
    data = inject<UiSnackbarData>(MAT_SNACK_BAR_DATA);

    get icon(): string {
        return this.data.icon ?? DEFAULT_ICON[this.data.variant];
    }

    dismiss(): void {
        this.snackBarRef?.dismiss();
    }
}
