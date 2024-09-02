import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    constructor(private _snackBar: MatSnackBar) {}

    openSuccess(message: string) {
        this._snackBar.open(message, '×', {
            duration: 3000,
            panelClass: ['success-snackbar'],
        });
    }

    openError(message: string) {
        this._snackBar.open(message, '×', {
            duration: 3000,
            panelClass: ['red-snackbar'],
        });
    }

    openPrimary(message: string) {
        this._snackBar.open(message, '×', {
            duration: 3000,
            panelClass: ['primary-snackbar'],
        });
    }

    openCustom(
        message: string,
        action: string,
        duration: number,
        panelClass: string
    ) {
        this._snackBar.open(message, action, {
            duration: duration,
            panelClass: [panelClass],
        });
    }
}
