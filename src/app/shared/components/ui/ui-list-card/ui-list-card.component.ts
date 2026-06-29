import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-ui-list-card',
    templateUrl: './ui-list-card.component.html',
    styleUrl: './ui-list-card.component.scss',
})
export class UiListCardComponent {
    @Input() title!: string;
    @Input() suffixText?: string;

    @Input() theme: 'primary' | 'warning' | 'default' = 'primary';
}
