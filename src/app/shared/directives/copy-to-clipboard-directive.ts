import { Directive, HostListener, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[copy-to-clipboard]',
})
export class CopyToClipboardDirective {
    @Input('copy-to-clipboard') value!: string | undefined | null;

    constructor(
        private clipboard: Clipboard,
        private _snackBar: MatSnackBar
    ) {}

    @HostListener('click', ['$event'])
    public onClick(event: MouseEvent): void {
        event.preventDefault();
        if (!this.value) return;
        this.clipboard.copy(this.value);
        this._snackBar.open('Copied to clipboard!', '×', {
            duration: 3000,
            panelClass: ['primary-snackbar'],
        });
    }
}
