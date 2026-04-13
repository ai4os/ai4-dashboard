import { Injectable } from '@angular/core';
import { MapMetric } from '../../components/stats/map-metric-selector/map-metric-selector.component';
import { getCssVar } from '@app/shared/utils/css-var.helper';

export interface LegendTier {
    label: string;
    color: string;
    max: number;
}

const NEUTRAL = '#B4B2A9';

const TIERS: Record<MapMetric, LegendTier[]> = {
    pue: [
        { label: '≤ 1.35', color: 'var(--good-value)', max: 1.35 },
        { label: '1.35 – 1.6', color: 'var(--neutral-value)', max: 1.6 },
        { label: '> 1.6', color: 'var(--bad-value)', max: Infinity },
    ],
    jobs: [
        { label: '0 – 5', color: 'var(--good-value)', max: 5 },
        { label: '6 – 15', color: 'var(--neutral-value)', max: 15 },
        { label: '> 15', color: 'var(--bad-value)', max: Infinity },
    ],
    co2: [
        { label: '< 350 g CO₂/kWh', color: 'var(--good-value)', max: 350 },
        {
            label: '350 – 700 g CO₂/kWh',
            color: 'var(--neutral-value)',
            max: 700,
        },
        { label: '> 700 g CO₂/kWh', color: 'var(--bad-value)', max: Infinity },
    ],
    water: [
        { label: '< 7 l/kWh', color: 'var(--good-value)', max: 7 },
        { label: '7 – 45 l/kWh', color: 'var(--neutral-value)', max: 45 },
        { label: '> 200 l/kWh', color: 'var(--bad-value)', max: Infinity },
    ],
    'green-score': [
        { label: '< 30', color: 'var(--bad-value)', max: 30 },
        { label: '30 – 60', color: 'var(--neutral-value)', max: 60 },
        { label: '> 60', color: 'var(--good-value)', max: 100 },
    ],
};

@Injectable({ providedIn: 'root' })
export class MetricColorService {
    private resolve(color: string): string {
        if (!color.startsWith('var(')) return color;
        const name = color.slice(4, -1).trim();
        return getCssVar(name) || NEUTRAL;
    }

    getColor(metric: MapMetric, value: number | null | undefined): string {
        if (value == null) return NEUTRAL;
        const tier = TIERS[metric].find((t) => value <= t.max);
        return tier ? this.resolve(tier.color) : NEUTRAL;
    }

    getLegend(metric: MapMetric): LegendTier[] {
        return TIERS[metric];
    }
}
