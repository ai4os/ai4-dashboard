import { Injectable, signal, computed } from '@angular/core';
import { ProfileService } from '@app/modules/profile/services/profile-service/profile.service';
import { StorageCredential } from '@app/shared/interfaces/profile.interface';

const AI4OS_ENDPOINT = 'share.cloud.ai4eosc.eu';

@Injectable({ providedIn: 'root' })
export class StorageProvidersStore {
    constructor(private profileService: ProfileService) {}

    private readonly _credentials = signal<StorageCredential[]>([]);
    private readonly _loading = signal(false);
    private loaded = false;

    readonly loading = this._loading.asReadonly();
    readonly credentials = this._credentials.asReadonly();

    readonly ai4osEndpoint = AI4OS_ENDPOINT;

    readonly ai4osCredential = computed(
        () =>
            this._credentials().find((c) => c.server === AI4OS_ENDPOINT) ?? null
    );

    readonly customCredentials = computed(() =>
        this._credentials().filter((c) => c.server !== AI4OS_ENDPOINT)
    );

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
        this.profileService.getExistingCredentials().subscribe({
            next: (raw) => {
                const list: StorageCredential[] = Object.entries(raw).map(
                    ([path, value]) => ({
                        vendor: value.vendor,
                        server: path.substring(path.lastIndexOf('/') + 1),
                        loginName: value.loginName,
                        appPassword: value.appPassword,
                    })
                );
                this._credentials.set(list);
                this.loaded = true;
                this._loading.set(false);
            },
            error: () => this._loading.set(false),
        });
    }

    credentialsExist(server: string): boolean {
        return this._credentials().some((c) => c.server === server);
    }
}
