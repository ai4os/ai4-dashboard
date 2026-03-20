import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-stats-reduced-card',
    templateUrl: './stats-reduced-card.component.html',
    styleUrl: './stats-reduced-card.component.scss',
})
export class StatsReducedCardComponent {
    @Input() label: string = '';
    @Input() value: string | number = '—';
    @Input() icon: string = '';
    @Input() unit?: string = '';
    @Input() tooltip?: string = '';
}
