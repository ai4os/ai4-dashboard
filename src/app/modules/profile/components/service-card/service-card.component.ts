import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-service-card',
    templateUrl: './service-card.component.html',
    styleUrl: './service-card.component.scss',
})
export class ServiceCardComponent {
    @Input() title!: string;
    @Input() statusLabel?: string;
    @Input() statusVariant: 'success-solid' | 'default-solid' = 'success-solid';
    @Input() accentColor?: string;

    get chipVariant():
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
        | 'default-outline' {
        return `${this.statusVariant}` as any;
    }
}
