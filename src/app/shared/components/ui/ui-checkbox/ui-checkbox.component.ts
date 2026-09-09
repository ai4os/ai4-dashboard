import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-ui-checkbox',
    standalone: true,
    imports: [CommonModule, MatTooltipModule, TranslatePipe],
    templateUrl: './ui-checkbox.component.html',
    styleUrl: './ui-checkbox.component.scss',
})
export class UiCheckboxComponent {
    @Input() checked = false;
    @Input() indeterminate = false;
    @Input() disabled = false;
    @Input() label?: string;
    @Input() tooltip?: string;
    @Input() variant: 'primary' | 'accent' | 'danger' = 'primary';

    @Output() valueChange = new EventEmitter<boolean>();

    toggle(): void {
        if (this.disabled) {
            return;
        }

        this.checked = !this.checked;
        this.indeterminate = false;
        this.valueChange.emit(this.checked);
    }

    onKeydown(event: KeyboardEvent): void {
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            this.toggle();
        }
    }
}
