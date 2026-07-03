import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-ui-card',
    templateUrl: './ui-card.component.html',
    styleUrls: ['./ui-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class UiCardComponent {
    @Input() accentColor?: string;
}
