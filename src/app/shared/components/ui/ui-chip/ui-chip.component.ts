import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-ui-chip',
    templateUrl: './ui-chip.component.html',
    styleUrl: './ui-chip.component.scss',
})
export class UiChipComponent {
    @Input() variant:
        | 'primary-solid'
        | 'primary-outline'
        | 'accent-solid'
        | 'accent-outline'
        | 'success-solid'
        | 'success-outline'
        | 'warning-solid'
        | 'warning-outline'
        | 'danger-solid'
        | 'danger-outline'
        | 'default-solid'
        | 'default-outline' = 'primary-solid';
    @Input() icon?: string;
    @Input() text?: string;
    @Input() tooltip?: string;
    @Input() disabled = false;

    ngOnInit(): void {
        if (!this.icon && !this.text) {
            throw new Error(
                'UiChipComponent: you should include either "icon" or "text".'
            );
        }
    }
}
