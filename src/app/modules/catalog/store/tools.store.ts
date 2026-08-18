import { Injectable, signal, inject } from '@angular/core';
import { ModuleSummary } from '@app/shared/interfaces/module.interface';
import { ToolsService } from '../services/tools-service/tools.service';

@Injectable({ providedIn: 'root' })
export class ToolsStore {
    private readonly toolsService = inject(ToolsService);

    private readonly _tools = signal<ModuleSummary[]>([]);
    private readonly _loading = signal(false);
    private readonly _error = signal(false);
    private loaded = false;

    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();
    readonly tools = this._tools.asReadonly();

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

        this.toolsService.getToolsSummary().subscribe({
            next: (tools) => {
                this._tools.set(tools);
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
