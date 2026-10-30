import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';

@Component({
    selector: 'app-stats-card',
    templateUrl: './stats-card.component.html',
    styleUrl: './stats-card.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatIcon, UiButtonComponent],
})
export class StatsCardComponent {
    @Input() label = '';
    @Input() icon = '';
    @Input() tooltip?: string;
    @Input() value: number | string = '—';
    @Input() total?: number;
    @Input() unit?: string;
    @Input() subtext?: string;
    @Input() color?: string = '';

    get hasTotal(): boolean {
        return !!this.total && this.total > 0;
    }

    get pct(): number {
        if (!this.hasTotal) return 0;
        const pct = (Number(this.value) / this.total!) * 100;
        return Math.min(100, Math.max(0, pct));
    }
}
