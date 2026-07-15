import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-stats-reduced-card',
    templateUrl: './stats-reduced-card.component.html',
    styleUrl: './stats-reduced-card.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class StatsReducedCardComponent {
    @Input() label = '';
    @Input() value: string | number = '—';
    @Input() icon = '';
    @Input() unit?: string = '';
    @Input() tooltip?: string = '';
}
