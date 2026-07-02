import { Component, Input } from '@angular/core';

export type ProviderCardStatus =
    | 'success-solid'
    | 'success-outline'
    | 'default-solid'
    | 'default-outline'
    | 'warning-solid'
    | 'warning-outline'
    | 'danger-solid'
    | 'danger-outline'
    | 'primary-solid'
    | 'primary-outline'
    | 'accent-solid'
    | 'accent-outline';

@Component({
    selector: 'app-service-card',
    templateUrl: './service-card.component.html',
    styleUrl: './service-card.component.scss',
})
export class ServiceCardComponent {
    @Input() title!: string;
    @Input() statusLabel?: string;
    @Input() statusVariant: ProviderCardStatus = 'success-solid';
    @Input() accentColor?: string;

    get chipVariant(): ProviderCardStatus {
        return `${this.statusVariant}` as any;
    }
}
