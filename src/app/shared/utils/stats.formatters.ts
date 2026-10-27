import { ResourceBar, PowerDisplay } from '../models/stats.view-models';

const round1 = (n: number) => Math.round(n * 10) / 10;

export function scaleMiB(
    used: number,
    total: number = used,
    maxUnit: 'GiB' | 'TiB' = 'GiB'
): ResourceBar {
    const units = maxUnit === 'TiB' ? ['MiB', 'GiB', 'TiB'] : ['MiB', 'GiB'];
    let step = 0;
    while (step < units.length - 1 && total / 1024 ** (step + 1) >= 1) step++;
    const div = 1024 ** step;
    return {
        used: round1(used / div),
        total: round1(total / div),
        unit: units[step],
    };
}

export function formatPower(w: number): PowerDisplay {
    return w >= 1000
        ? { value: round1(w / 1000), unit: 'kW' }
        : { value: Math.round(w), unit: 'W' };
}

export interface UnitStep {
    unit: string;
    factor: number;
    from?: number;
}

export const POWER_UNITS: UnitStep[] = [
    { unit: 'W', factor: 1 },
    { unit: 'kW', factor: 1e3 },
    { unit: 'MW', factor: 1e6, from: 1e7 },
];

export const ENERGY_UNITS: UnitStep[] = [
    { unit: 'Wh', factor: 1 },
    { unit: 'kWh', factor: 1e3 },
    { unit: 'MWh', factor: 1e6, from: 1e7 },
];

export const CARBON_UNITS: UnitStep[] = [
    { unit: 'g CO₂', factor: 1 },
    { unit: 'kg CO₂', factor: 1e3 },
    { unit: 't CO₂', factor: 1e6, from: 1e7 },
];

export const WATER_UNITS: UnitStep[] = [
    { unit: 'l', factor: 1 },
    { unit: 'm³', factor: 1e3, from: 1e5 },
];

export function pickUnit(reference: number, steps: UnitStep[]): UnitStep {
    let chosen = steps[0];
    for (const step of steps) {
        if (Math.abs(reference) >= (step.from ?? step.factor)) chosen = step;
    }
    return chosen;
}

export function decimalsFor(v: number): number {
    const abs = Math.abs(v);
    if (abs >= 100) return 0;
    if (abs >= 10) return 1;
    return 2;
}

export function formatQuantity(
    base: number,
    steps: UnitStep[]
): { value: number; unit: string } {
    const step = pickUnit(base, steps);
    const scaled = base / step.factor;
    const f = 10 ** decimalsFor(scaled);
    return { value: Math.round(scaled * f) / f, unit: step.unit };
}

export const formatEnergy = (wh: number) => formatQuantity(wh, ENERGY_UNITS);
export const formatCarbon = (g: number) => formatQuantity(g, CARBON_UNITS);
export const formatWater = (l: number) => formatQuantity(l, WATER_UNITS);
