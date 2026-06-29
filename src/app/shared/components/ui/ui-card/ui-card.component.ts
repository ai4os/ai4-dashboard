import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-ui-card',
    templateUrl: './ui-card.component.html',
    styleUrls: ['./ui-card.component.scss'],
})
export class UiCardComponent {
    @Input() accentColor?: string;
}
