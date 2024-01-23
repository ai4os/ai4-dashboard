import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-stats-container',
    templateUrl: './stats-container.component.html',
    styleUrls: ['./stats-container.component.scss'],
})
export class StatsContainerComponent {
    @Input() cpuNum: string = '0';
    @Input() cpuMhz?: string;
    @Input() memoryMB: string = '0';
    @Input() diskMB: string = '0';
    @Input() gpuNum: string = '0';
}
