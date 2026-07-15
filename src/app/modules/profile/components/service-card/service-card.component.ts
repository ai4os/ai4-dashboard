import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { UiCardComponent } from '../../../../shared/components/ui/ui-card/ui-card.component';
import { UiChipComponent } from '../../../../shared/components/ui/ui-chip/ui-chip.component';

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
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [UiCardComponent, UiChipComponent],
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
