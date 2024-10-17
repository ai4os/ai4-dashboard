import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-chip-with-icon',
    templateUrl: './chip-with-icon.component.html',
    styleUrls: ['./chip-with-icon.component.scss'],
})
export class ChipWithIconComponent {
    @Input()
        text!: string;
    @Input()
        icon?: string;
    @Input()
        image?: string;
    @Input()
        tooltip?: string;
    @Input() chipStyle = 'default';
}
