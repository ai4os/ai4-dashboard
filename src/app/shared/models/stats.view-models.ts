import { DatacenterStats } from '@app/shared/interfaces/stats.interface';

export interface ResourceBar {
    used: number;
    total: number;
    unit?: string;
}

export interface ResourceSet {
    cpu: ResourceBar;
    memory: ResourceBar;
    disk: ResourceBar;
    gpu: ResourceBar;
}

export interface GpuModelUsage {
    model: string;
    used: number;
    total: number;
}

export interface PowerDisplay {
    value: number;
    unit: 'W' | 'kW';
}

export interface EnergyPoint {
    /** epoch ms (UTC) */
    ts: number;
    powerW: number;
    energyWh: number;
    carbonG: number;
    waterL: number;
    live: boolean;
}

export interface EnergyViewModel {
    energyWh: number;
    carbonG: number;
    waterL: number;
    powerW: number | null;
    tueFactor: number;
    since: string;
    asOf: string;
    dataUntil: string;
    isLive: boolean;
    complete: boolean;
    degraded: boolean;
    coverageRatio: number | null;
    datacenters: string[];
    deployments: number | null;
    series: EnergyPoint[];
}

export interface ClusterViewModel {
    updatedAt: string;
    jobs: number;
    resources: ResourceSet;
    gpuModels: GpuModelUsage[];
    power: {
        currentW: number | null;
        current: PowerDisplay | null;
        reporting: number;
        total: number;
    };
    datacenterEnergy: Record<string, EnergyViewModel>;
    /** TODO: TEMPORAL */
    datacenters: DatacenterStats[];
}

export interface UserTimeseries {
    dates: string[];
    cpuNum: number[];
    cpuMhz: number[];
    memoryMB: number[];
    diskMB: number[];
    gpuNum: number[];
    queued: number[];
    running: number[];
}

export interface UserViewModel {
    usage: ResourceSet;
    timeseries: UserTimeseries;
    energy: EnergyViewModel | null;
}

export interface LoadState<T> {
    loading: boolean;
    data: T | null;
}
