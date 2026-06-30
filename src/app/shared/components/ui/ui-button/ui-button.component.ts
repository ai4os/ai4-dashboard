import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-ui-button',
    templateUrl: './ui-button.component.html',
    styleUrl: './ui-button.component.scss',
})
export class UiButtonComponent {
    @Input() variant:
        | 'primary-solid'
        | 'primary-outline'
        | 'accent-solid'
        | 'accent-outline'
        | 'danger-solid'
        | 'danger-outline'
        | 'icon' = 'primary-solid';
    @Input() icon?: string;
    @Input() text?: string;
    @Input() disabled = false;
    @Input() tooltip?: string;
    @Input() href?: string;

    ngOnInit(): void {
        if (!this.icon && !this.text) {
            throw new Error(
                'UiButtonComponent: you should include either "icon" or "text".'
            );
        }
    }

    onClick() {
        if (this.href) {
            window.open(this.href, '_blank', 'noopener,noreferrer');
        }
    }
}
