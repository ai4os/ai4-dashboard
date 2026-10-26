import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';

@Component({
    selector: 'app-stats-reduced-card',
    templateUrl: './stats-reduced-card.component.html',
    styleUrl: './stats-reduced-card.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatIcon, UiButtonComponent],
})
export class StatsReducedCardComponent {
    @Input() label = '';
    @Input() value: string | number = '—';
    @Input() icon = '';
    @Input() unit?: string = '';
    @Input() tooltip?: string = '';
    @Input() color?: string = '';
}
