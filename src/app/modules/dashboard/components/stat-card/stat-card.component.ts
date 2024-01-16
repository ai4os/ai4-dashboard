import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-stat-card',
    templateUrl: './stat-card.component.html',
    styleUrls: ['./stat-card.component.scss'],
})
export class StatCardComponent {
    @Input() title: string = '';
    @Input() value: number = 0;
    @Input() icon_name: String = '';
}
