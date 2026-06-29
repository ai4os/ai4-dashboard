import { Component, inject, Input } from '@angular/core';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-ui-credential-row',
    templateUrl: './ui-credential-row.component.html',
    styleUrls: ['./ui-credential-row.component.scss'],
})
export class UiCredentialRowComponent {
    @Input() value = '';
    @Input() maskable = false;

    hidden = true;

    snackbar = inject(SnackbarService);
    translate = inject(TranslateService);

    toggleVisibility(): void {
        this.hidden = !this.hidden;
    }

    async onCopy(): Promise<void> {
        await navigator.clipboard.writeText(this.value);
        this.snackbar.openAccent(
            this.translate.instant('GENERAL.COPIED-TO-CLIPBOARD')
        );
    }

    get displayValue(): string {
        if (!this.maskable || !this.hidden) return this.value;
        return '•'.repeat(Math.min(this.value.length, 20));
    }
}
