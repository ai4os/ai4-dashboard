import {
    Component,
    EventEmitter,
    Input,
    Output,
    ChangeDetectionStrategy,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

export type MapMetric =
    'pue' | 'jobs' | 'co2' | 'water' | 'environmental-score';

export interface MetricOption {
    key: MapMetric;
    label: string;
    icon: string;
}

@Component({
    selector: 'app-map-metric-selector',
    templateUrl: './map-metric-selector.component.html',
    styleUrls: ['./map-metric-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatIcon],
})
export class MapMetricSelectorComponent {
    @Input() active: MapMetric = 'pue';
    @Output() activeChange = new EventEmitter<MapMetric>();

    readonly metrics: MetricOption[] = [
        { key: 'pue', label: 'PUE', icon: 'bolt' },
        { key: 'jobs', label: 'Jobs', icon: 'task' },
        { key: 'co2', label: 'CO₂', icon: 'factory' },
        { key: 'water', label: 'Water', icon: 'water_drop' },
        {
            key: 'environmental-score',
            label: 'Environmental score',
            icon: 'eco',
        },
    ];

    select(key: MapMetric): void {
        this.activeChange.emit(key);
    }
}
