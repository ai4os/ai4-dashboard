import { Injectable, signal, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
    Ai4lifeModule,
    ModuleSummary,
} from '@app/shared/interfaces/module.interface';
import { ModulesService } from '../services/modules-service/modules.service';

@Injectable({ providedIn: 'root' })
export class ModulesStore {
    private readonly modulesService = inject(ModulesService);

    private readonly _ai4eoscModules = signal<ModuleSummary[]>([]);
    private readonly _ai4lifeModules = signal<Ai4lifeModule[]>([]);
    private readonly _loading = signal(false);
    private readonly _error = signal(false);
    private loaded = false;

    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();
    readonly ai4eoscModules = this._ai4eoscModules.asReadonly();
    readonly ai4lifeModules = this._ai4lifeModules.asReadonly();

    ensureLoaded(): void {
        if (this.loaded || this._loading()) return;
        this.fetch();
    }

    forceReload(): void {
        this.loaded = false;
        this.fetch();
    }

    private fetch(): void {
        this._loading.set(true);
        this._error.set(false);

        forkJoin({
            ai4eosc: this.modulesService.getModulesSummary(),
            ai4life: this.modulesService.getAi4lifeModules(),
        }).subscribe({
            next: ({ ai4eosc, ai4life }) => {
                this._ai4eoscModules.set(ai4eosc);
                this._ai4lifeModules.set(ai4life);
                this.loaded = true;
                this._loading.set(false);
            },
            error: () => {
                this._loading.set(false);
                this._error.set(true);
            },
        });
    }
}
