import {
    ClusterStats,
    DatacenterStats,
    EnergySeriesPoint,
    EnergyStats,
    SeriesPoint,
    UserStats,
} from '@app/shared/interfaces/stats.interface';
import {
    EnergyPoint,
    EnergyViewModel,
    ClusterViewModel,
    UserViewModel,
} from '@app/shared/models/stats.view-models';
import { scaleMiB, formatPower } from '@app/shared/utils/stats.formatters';

function mapEnergySeries(
    raw: EnergySeriesPoint[] | null | undefined
): EnergyPoint[] {
    return (raw ?? [])
        .map((p): EnergyPoint => ({
            ts: Date.parse(p.ts),
            powerW: p.power_w,
            energyWh: p.energy_wh,
            carbonG: p.carbon_g,
            waterL: p.water_l,
            live: p.live,
        }))
        .filter((p) => Number.isFinite(p.ts))
        .sort((a, b) => a.ts - b.ts);
}

export function mapEnergy(
    raw: EnergyStats | null | undefined
): EnergyViewModel | null {
    if (!raw) return null;
    return {
        energyWh: raw.energy_wh,
        carbonG: raw.carbon_g,
        waterL: raw.water_l,
        powerW: raw.power_w,
        tueFactor: raw.tue_factor,
        since: raw.since,
        asOf: raw.live_as_of ?? raw.as_of,
        dataUntil: raw.as_of,
        isLive: raw.live_as_of != null,
        complete: raw.complete,
        degraded: raw.degraded,
        coverageRatio: raw.coverage_ratio,
        datacenters: raw.datacenters ?? [],
        deployments: raw.deployments,
        series: mapEnergySeries(raw.series),
    };
}

export function mapCluster(raw: ClusterStats | null): ClusterViewModel | null {
    if (!raw?.cluster) return null;
    const c = raw.cluster;
    const dcs = Object.entries(raw.datacenters ?? {});

    const datacenterEnergy: Record<string, EnergyViewModel> = {};
    let powerW = 0;
    let reporting = 0;
    for (const [name, dc] of dcs) {
        const energy = mapEnergy(dc.energy);
        if (!energy) continue;
        datacenterEnergy[name] = energy;
        if (energy.powerW !== null) {
            powerW += energy.powerW;
            reporting++;
        }
    }

    return {
        updatedAt: raw.updated_at,
        jobs: c.jobs_num,
        resources: {
            cpu: { used: c.cpu_used, total: c.cpu_total },
            memory: scaleMiB(c.ram_used, c.ram_total),
            disk: scaleMiB(c.disk_used, c.disk_total),
            gpu: { used: c.gpu_used, total: c.gpu_total },
        },
        gpuModels: Object.entries(c.gpu_models ?? {}).map(([model, g]) => ({
            model,
            used: g.gpu_used,
            total: g.gpu_total,
        })),
        power: {
            currentW: reporting ? powerW : null,
            current: reporting ? formatPower(powerW) : null,
            reporting,
            total: dcs.length,
        },
        datacenterEnergy,
        datacenters: mapLegacyDatacenters(raw),
    };
}

export function mapUser(raw: UserStats | null): UserViewModel | null {
    const u = raw?.['users-agg'];
    const f = raw?.['full-agg'];
    if (!raw || !u || !f) return null;
    const t = raw.timeseries;
    return {
        usage: {
            cpu: { used: u.cpu_num, total: f.cpu_num },
            memory: scaleMiB(u.memory_MB, f.memory_MB, 'TiB'),
            disk: scaleMiB(u.disk_MB, f.disk_MB, 'TiB'),
            gpu: { used: u.gpu_num, total: f.gpu_num },
        },
        timeseries: {
            dates: t?.date ?? [],
            cpuNum: t?.cpu_num ?? [],
            cpuMhz: t?.cpu_MHz ?? [],
            memoryMB: t?.memory_MB ?? [],
            diskMB: t?.disk_MB ?? [],
            gpuNum: t?.gpu_num ?? [],
            queued: t?.queued ?? [],
            running: t?.running ?? [],
        },
        energy: mapEnergy(raw.energy),
    };
}

/** TODO: TEMPORAL */
function mapLegacyDatacenters(raw: ClusterStats): DatacenterStats[] {
    const last = (s?: SeriesPoint[]) => (s?.length ? s[s.length - 1][1] : 0);

    return Object.entries(raw.datacenters ?? {}).map(([name, dc]) => ({
        name,
        lat: dc.lat,
        lon: dc.lon,
        PUE: dc.PUE,
        energy_quality: last(dc.footprints?.carbon),
        energy_water_usage: last(dc.footprints?.water),
        green_score: last(dc.footprints?.['environmental-score']),
        nodes: Object.values(dc.nodes ?? {}),
        affinity: dc.affinity ?? 0,
        country: dc.country ?? '',
        footprints: dc.footprints,
    }));
}
