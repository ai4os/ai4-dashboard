import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-ui-list-card',
    templateUrl: './ui-list-card.component.html',
    styleUrl: './ui-list-card.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class UiListCardComponent {
    @Input() title!: string;
    @Input() suffixText?: string;
    @Input() theme: 'primary' | 'warning' | 'default' = 'primary';
    @Input() tooltip?: string;
}
