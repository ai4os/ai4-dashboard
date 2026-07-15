import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
    selector: 'app-stats-reduced-card',
    templateUrl: './stats-reduced-card.component.html',
    styleUrl: './stats-reduced-card.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatIcon, MatTooltip],
})
export class StatsReducedCardComponent {
    @Input() label = '';
    @Input() value: string | number = '—';
    @Input() icon = '';
    @Input() unit?: string = '';
    @Input() tooltip?: string = '';
}
