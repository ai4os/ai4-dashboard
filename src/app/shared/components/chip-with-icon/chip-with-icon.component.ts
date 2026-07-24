import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-chip-with-icon',
    templateUrl: './chip-with-icon.component.html',
    styleUrls: ['./chip-with-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgClass, MatTooltip, MatIcon],
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
