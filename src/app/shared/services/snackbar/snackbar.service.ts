import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export enum PanelClass {
    Success = 'success-snackbar',
    Error = 'red-snackbar',
    Primary = 'primary-snackbar',
}

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    constructor(private _snackBar: MatSnackBar) {}

    openSuccess(message: string) {
        this._snackBar.open(message, '×', {
            duration: 3000,
            panelClass: PanelClass.Success,
        });
    }

    openError(message: string) {
        this._snackBar.open(message, '×', {
            duration: 3000,
            panelClass: PanelClass.Error,
        });
    }

    openPrimary(message: string) {
        this._snackBar.open(message, '×', {
            duration: 3000,
            panelClass: PanelClass.Primary,
        });
    }

    openCustom(
        message: string,
        action: string,
        duration: number,
        panelClass: PanelClass
    ) {
        this._snackBar.open(message, action, {
            duration: duration,
            panelClass: [panelClass],
        });
    }
}
