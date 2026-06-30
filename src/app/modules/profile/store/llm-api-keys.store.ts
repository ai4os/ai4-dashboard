import { Injectable, signal } from '@angular/core';
import { LlmApiKeysService } from '@app/modules/profile/services/llm-api-keys-service/llm-api-keys.service';
import {
    LiteLLMKey,
    LiteLLMKeyResponse,
} from '@app/shared/interfaces/profile.interface';

export interface ApiKeyRow {
    id: string;
    name: string;
    createdAt: Date;
    expires: Date | null;
}

@Injectable({ providedIn: 'root' })
export class LlmApiKeysStore {
    constructor(private llmApiKeysService: LlmApiKeysService) {}

    private readonly _apiKeys = signal<ApiKeyRow[]>([]);
    private readonly _loading = signal(false);
    private loaded = false;

    readonly apiKeys = this._apiKeys.asReadonly();
    readonly loading = this._loading.asReadonly();

    ensureLoaded(): void {
        if (this.loaded || this._loading()) return;
        this._loading.set(true);
        this.llmApiKeysService.getLiteLLMKeys().subscribe({
            next: (keys) => {
                this._apiKeys.set(keys.map((k) => this.mapKey(k)));
                this.loaded = true;
                this._loading.set(false);
            },
            error: () => {
                this._loading.set(false);
            },
        });
    }

    forceReload(): void {
        this.loaded = false;
        this.ensureLoaded();
    }

    addKey(row: ApiKeyRow): void {
        this._apiKeys.update((rows) => [...rows, row]);
    }

    removeKey(id: string): void {
        this._apiKeys.update((rows) => rows.filter((r) => r.id !== id));
    }

    hasKeyId(id: string): boolean {
        return this._apiKeys().some((k) => k.id === id);
    }

    private mapKey(k: LiteLLMKeyResponse): ApiKeyRow {
        return {
            id: k.id,
            name: k.id,
            createdAt: new Date(k.created_at),
            expires: k.expires ? new Date(k.expires) : null,
        };
    }
}
