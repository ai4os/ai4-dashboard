import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-chip-with-icon',
    templateUrl: './chip-with-icon.component.html',
    styleUrls: ['./chip-with-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
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
