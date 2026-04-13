import { Component, EventEmitter, Input, Output } from '@angular/core';

export type MapMetric = 'pue' | 'jobs' | 'co2' | 'water' | 'green-score';

export interface MetricOption {
    key: MapMetric;
    label: string;
    icon: string;
}

@Component({
    selector: 'app-map-metric-selector',
    templateUrl: './map-metric-selector.component.html',
    styleUrls: ['./map-metric-selector.component.scss'],
})
export class MapMetricSelectorComponent {
    @Input() active: MapMetric = 'pue';
    @Output() activeChange = new EventEmitter<MapMetric>();

    readonly metrics: MetricOption[] = [
        { key: 'pue', label: 'PUE', icon: 'bolt' },
        { key: 'jobs', label: 'Jobs', icon: 'task' },
        { key: 'co2', label: 'CO₂', icon: 'factory' },
        { key: 'water', label: 'Water', icon: 'water_drop' },
        { key: 'green-score', label: 'Green Score', icon: 'eco' },
    ];

    select(key: MapMetric): void {
        this.activeChange.emit(key);
    }
}
