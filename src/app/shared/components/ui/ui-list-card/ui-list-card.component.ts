import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
    selector: 'app-ui-list-card',
    templateUrl: './ui-list-card.component.html',
    styleUrl: './ui-list-card.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatTooltip],
})
export class UiListCardComponent {
    @Input() title!: string;
    @Input() suffixText?: string;
    @Input() theme: 'primary' | 'warning' | 'default' = 'primary';
    @Input() tooltip?: string;
}
