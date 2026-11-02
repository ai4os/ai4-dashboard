import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ResourceBarComponent } from '../resource-bar/resource-bar.component';

@Component({
    selector: 'app-resources-card',
    templateUrl: './resources-card.component.html',
    styleUrl: './resources-card.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ResourceBarComponent],
})
export class ResourcesCardComponent {
    @Input() usedCpu = 0;
    @Input() totalCpu = 0;
    @Input() usedMem = 0;
    @Input() totalMem = 0;
    @Input() memUnit = 'GiB';
    @Input() usedDisk = 0;
    @Input() totalDisk = 0;
    @Input() diskUnit = 'GiB';
    @Input() usedGpu = 0;
    @Input() totalGpu = 0;
}
