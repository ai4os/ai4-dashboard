import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-resources-card',
    templateUrl: './resources-card.component.html',
    styleUrl: './resources-card.component.scss',
})
export class ResourcesCardComponent {
    @Input() usedCpu: number = 0;
    @Input() totalCpu: number = 0;
    @Input() usedMem: number = 0;
    @Input() totalMem: number = 0;
    @Input() memUnit: string = 'GiB';
    @Input() usedDisk: number = 0;
    @Input() totalDisk: number = 0;
    @Input() diskUnit: string = 'GiB';
    @Input() usedGpu: number = 0;
    @Input() totalGpu: number = 0;
}
