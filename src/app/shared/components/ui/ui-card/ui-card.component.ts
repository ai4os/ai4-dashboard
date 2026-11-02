import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
    selector: 'app-ui-card',
    templateUrl: './ui-card.component.html',
    styleUrls: ['./ui-card.component.scss'],
    imports: [MatTooltip],
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class UiCardComponent {
    @Input() accentColor?: string;
    @Input() disabled? = false;
    @Input() tooltip?: string;
}
