import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-graphs-tab',
    templateUrl: './graphs-tab.component.html',
    styleUrls: ['./graphs-tab.component.scss'],
})
export class GraphsTabComponent {
    @Input() dates: string[] = [];
    @Input() cpuMhzData: number[] = [];
    @Input() cpuNumData: number[] = [];
    @Input() memoryMBData: number[] = [];
    @Input() diskMBData: number[] = [];
    @Input() gpuNumData: number[] = [];
    @Input() queuedData: number[] = [];
    @Input() runningData: number[] = [];
}
