import { EnergyPoint } from '@app/shared/models/stats.view-models';

export type FootprintRange = '24h' | '7d' | '30d' | '90d' | 'total';
export type Grouping = 'sample' | 'day';
export type FootprintMetric = 'powerW' | 'energyWh' | 'carbonG' | 'waterL';

export interface EnergyGroup {
    name: string;
    points: EnergyPoint[];
}

export type MetricMatrix = (number | null)[][];

export interface FootprintView {
    grouping: Grouping;
    timestamps: number[];
    perPeriod: Record<FootprintMetric, MetricMatrix>;
    cumulative: Record<FootprintMetric, MetricMatrix>;
    totals: Record<FootprintMetric, number>;
    windowDays: number | null;
}

export const FOOTPRINT_RANGES: {
    id: FootprintRange;
    label: string;
    days: number;
    grouping: Grouping;
}[] = [
    { id: '24h', label: '24h', days: 1, grouping: 'sample' },
    { id: '7d', label: '7d', days: 7, grouping: 'day' },
    { id: '30d', label: '30d', days: 30, grouping: 'day' },
    { id: '90d', label: '90d', days: 90, grouping: 'day' },
    { id: 'total', label: 'Total', days: Infinity, grouping: 'day' },
];

export const METRICS: FootprintMetric[] = [
    'powerW',
    'energyWh',
    'carbonG',
    'waterL',
];

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfUtcDay = (ms: number): number => Math.floor(ms / DAY_MS) * DAY_MS;

type Bucket = Record<FootprintMetric, number> & { powerCount: number };

const emptyRecord = <T>(make: () => T): Record<FootprintMetric, T> => ({
    powerW: make(),
    energyWh: make(),
    carbonG: make(),
    waterL: make(),
});

export function emptyView(grouping: Grouping = 'day'): FootprintView {
    return {
        grouping,
        timestamps: [],
        perPeriod: emptyRecord(() => []),
        cumulative: emptyRecord(() => []),
        totals: { powerW: 0, energyWh: 0, carbonG: 0, waterL: 0 },
        windowDays: null,
    };
}

export function buildFootprintView(
    groups: EnergyGroup[],
    range: FootprintRange
): FootprintView {
    const def =
        FOOTPRINT_RANGES.find((r) => r.id === range) ?? FOOTPRINT_RANGES[0];

    let anchor = -Infinity;
    for (const g of groups) {
        for (const p of g.points) if (p.ts > anchor) anchor = p.ts;
    }
    if (!Number.isFinite(anchor)) return emptyView(def.grouping);

    const start =
        def.days === Infinity
            ? -Infinity
            : def.grouping === 'sample'
              ? anchor - DAY_MS
              : startOfUtcDay(anchor) - (def.days - 1) * DAY_MS;
    const inWindow = (ts: number) =>
        def.grouping === 'sample' ? ts > start : ts >= start;
    const keyOf = (ts: number) =>
        def.grouping === 'day' ? startOfUtcDay(ts) : ts;

    const perGroup: Map<number, Bucket>[] = groups.map((g) => {
        const buckets = new Map<number, Bucket>();
        for (const p of g.points) {
            if (!inWindow(p.ts)) continue;
            const key = keyOf(p.ts);
            const b =
                buckets.get(key) ??
                ({
                    powerW: 0,
                    energyWh: 0,
                    carbonG: 0,
                    waterL: 0,
                    powerCount: 0,
                } as Bucket);

            if (p.powerW != null) {
                b.powerW += p.powerW;
                b.powerCount++;
            }

            b.energyWh += p.energyWh;
            b.carbonG += p.carbonG;
            b.waterL += p.waterL;
            buckets.set(key, b);
        }

        // Calculate the average powerW when grouping by day
        if (def.grouping === 'day') {
            for (const b of buckets.values()) {
                if (b.powerCount > 0) {
                    b.powerW = b.powerW / b.powerCount;
                }
            }
        }

        return buckets;
    });

    const timestamps = [
        ...new Set(perGroup.flatMap((m) => [...m.keys()])),
    ].sort((a, b) => a - b);

    const perPeriod = emptyRecord<MetricMatrix>(() => []);
    const cumulative = emptyRecord<MetricMatrix>(() => []);
    const totals: Record<FootprintMetric, number> = {
        powerW: 0,
        energyWh: 0,
        carbonG: 0,
        waterL: 0,
    };

    for (const metric of METRICS) {
        perPeriod[metric] = perGroup.map((m) =>
            timestamps.map((t) => m.get(t)?.[metric] ?? null)
        );
        cumulative[metric] = perPeriod[metric].map((row) => {
            let running = 0;
            return row.map((v) => (running += v ?? 0));
        });
        totals[metric] = perPeriod[metric].reduce(
            (sum, row) => sum + row.reduce<number>((s, v) => s + (v ?? 0), 0),
            0
        );
    }

    totals.powerW = groups.reduce((sum, g) => {
        let last: EnergyPoint | undefined;
        for (const p of g.points) {
            if (
                p.powerW != null &&
                inWindow(p.ts) &&
                (!last || p.ts > last.ts)
            ) {
                last = p;
            }
        }
        return sum + (last?.powerW ?? 0);
    }, 0);

    return {
        grouping: def.grouping,
        timestamps,
        perPeriod,
        cumulative,
        totals,
        windowDays: Number.isFinite(def.days) && def.days > 1 ? def.days : null,
    };
}

export function maxStacked(matrix: MetricMatrix): number {
    const length = matrix[0]?.length ?? 0;
    let max = 0;
    for (let i = 0; i < length; i++) {
        let sum = 0;
        for (const row of matrix) sum += row[i] ?? 0;
        if (sum > max) max = sum;
    }
    return max;
}

export function scaleMatrix(
    matrix: MetricMatrix,
    factor: number
): MetricMatrix {
    return matrix.map((row) =>
        row.map((v) => (v === null ? null : v / factor))
    );
}

const labelFormats: Record<Grouping, Intl.DateTimeFormatOptions> = {
    day: { day: '2-digit', month: 'short', timeZone: 'UTC' },
    sample: {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
    },
};

export const formatBucketLabel = (ms: number, grouping: Grouping): string =>
    new Date(ms).toLocaleString('en-GB', labelFormats[grouping]);

export const formatDateLabel = (isoOrMs: string | number): string =>
    new Date(isoOrMs).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
    });
