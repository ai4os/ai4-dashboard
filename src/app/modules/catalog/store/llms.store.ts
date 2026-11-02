import { Injectable, signal, inject } from '@angular/core';
import {
    PlatformLlmSummary,
    SelfLllmSummary,
} from '@app/shared/interfaces/llms.interface';
import { LlmsService } from '../services/llms.service';
import { forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LlmsStore {
    llmsService = inject(LlmsService);

    private readonly _selfLlms = signal<SelfLllmSummary[]>([]);
    private readonly _platformLlms = signal<PlatformLlmSummary[]>([]);
    private readonly _loading = signal(false);
    private readonly _error = signal(false);
    private loaded = false;

    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();
    readonly selfLlms = this._selfLlms.asReadonly();
    readonly platformLlms = this._platformLlms.asReadonly();

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
            self: this.llmsService.getSefLlmsSummary(),
            platform: this.llmsService.getPlatformLlmsSummary(),
        }).subscribe({
            next: ({ self, platform }) => {
                this._selfLlms.set(self);
                this._platformLlms.set(platform);
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
