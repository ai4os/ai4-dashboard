import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-stats-container',
    templateUrl: './stats-container.component.html',
    styleUrls: ['./stats-container.component.scss'],
})
export class StatsContainerComponent {
    @Input() values: string[] = []; // cpu_num, cpu_MHz, memory_MB, disk_MB, gpu_num
}
