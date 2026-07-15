import { Directive, HostListener, inject, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { SnackbarService } from '../services/snackbar/snackbar.service';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[copy-to-clipboard]',
    standalone: false,
})
export class CopyToClipboardDirective {
    @Input('copy-to-clipboard') value!: string | undefined | null;

    clipboard = inject(Clipboard);
    snackbarService = inject(SnackbarService);

    @HostListener('click', ['$event'])
    public onClick(event: MouseEvent): void {
        event.preventDefault();
        if (!this.value) return;
        this.clipboard.copy(this.value);
        this.snackbarService.openPrimary('Copied to clipboard!');
    }
}
