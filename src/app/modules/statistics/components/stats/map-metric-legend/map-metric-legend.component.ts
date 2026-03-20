import { Component, Input, OnChanges } from '@angular/core';
import { MapMetric } from '../map-metric-selector/map-metric-selector.component';
import {
    LegendTier,
    MetricColorService,
} from '@app/modules/statistics/services/metric-color/metric-color.service';

@Component({
    selector: 'app-map-metric-legend',
    templateUrl: './map-metric-legend.component.html',
    styleUrls: ['./map-metric-legend.component.scss'],
})
export class MapMetricLegendComponent implements OnChanges {
    @Input() metric: MapMetric = 'pue';

    tiers: LegendTier[] = [];

    constructor(private metricColor: MetricColorService) {}

    ngOnChanges(): void {
        this.tiers = this.metricColor.getLegend(this.metric);
    }
}
