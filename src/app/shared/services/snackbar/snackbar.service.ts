import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import {
    UiSnackbarVariant,
    UiSnackbarComponent,
    UiSnackbarData,
} from '@app/shared/components/ui/ui-snackbar/ui-snackbar.component';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    constructor(private _snackBar: MatSnackBar) {}

    baseDuration = 3000;
    durationPerChar = 50;

    openSuccess(message: string): void {
        this.open(message, 'success');
    }

    openError(message: string): void {
        this.open(message, 'danger');
    }

    openPrimary(message: string): void {
        this.open(message, 'primary');
    }

    openAccent(message: string): void {
        this.open(message, 'accent');
    }

    openCustom(
        message: string,
        variant: UiSnackbarVariant,
        duration?: number
    ): MatSnackBarRef<UiSnackbarComponent> {
        return this.open(message, variant, duration);
    }

    private open(
        message: string,
        variant: UiSnackbarVariant,
        duration?: number
    ): MatSnackBarRef<UiSnackbarComponent> {
        const data: UiSnackbarData = { text: message, variant };

        return this._snackBar.openFromComponent(UiSnackbarComponent, {
            data,
            duration: duration ?? this.getMessageDuration(message),
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: 'ui-snackbar-panel',
        });
    }

    getMessageDuration(message: string): number {
        return this.baseDuration + message.length * this.durationPerChar;
    }
}
