import { Injectable, inject, signal } from '@angular/core';
import { Subscription, exhaustMap, filter, timer } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';
import { DashboardStatsService } from '@app/modules/statistics/services/dashboard-stats/dashboard-stats.service';
import {
    ClusterViewModel,
    LoadState,
    UserViewModel,
} from '@app/shared/models/stats.view-models';

export const STATS_REFRESH_MS = 5 * 60 * 1000;

type Source = 'cluster' | 'user';

function mergeLoadState<T>(
    prev: LoadState<T>,
    next: LoadState<T>
): LoadState<T> {
    if (!prev.data) return next;
    if (next.loading) return prev;
    return next.data ? next : prev;
}

@Injectable({ providedIn: 'root' })
export class StatsStore {
    private readonly dashboardStats = inject(DashboardStatsService);
    private readonly authService = inject(AuthService);

    private readonly _cluster = signal<LoadState<ClusterViewModel>>({
        loading: true,
        data: null,
    });
    private readonly _user = signal<LoadState<UserViewModel>>({
        loading: false,
        data: null,
    });

    readonly cluster = this._cluster.asReadonly();
    readonly user = this._user.asReadonly();

    private readonly watchers: Record<Source, number> = { cluster: 0, user: 0 };
    private readonly polling: Partial<Record<Source, Subscription>> = {};

    constructor() {
        this.authService.userProfile$.subscribe((profile) => {
            if (!profile?.isAuthenticated) {
                this.resetUser();
            } else if (this.watchers.user > 0) {
                this.startPolling('user');
            }
        });
    }

    connectCluster(): () => void {
        return this.connect('cluster');
    }

    connectUser(): () => void {
        if (!this.authService.isAuthenticated()) return () => undefined;
        return this.connect('user');
    }

    private connect(source: Source): () => void {
        this.watchers[source]++;
        this.startPolling(source);

        let released = false;
        return () => {
            if (released) return;
            released = true;
            if (--this.watchers[source] === 0) this.stopPolling(source);
        };
    }

    private startPolling(source: Source): void {
        if (this.polling[source]) return;

        if (source === 'user' && !this._user().data) {
            this._user.set({ loading: true, data: null });
        }

        this.polling[source] = timer(0, STATS_REFRESH_MS)
            .pipe(
                filter((tick) => tick === 0 || !document.hidden),
                exhaustMap(() =>
                    source === 'cluster'
                        ? this.dashboardStats.loadCluster()
                        : this.dashboardStats.loadUser()
                )
            )
            .subscribe((next) => {
                if (source === 'cluster') {
                    this._cluster.update((prev) =>
                        mergeLoadState(
                            prev,
                            next as LoadState<ClusterViewModel>
                        )
                    );
                } else {
                    this._user.update((prev) =>
                        mergeLoadState(prev, next as LoadState<UserViewModel>)
                    );
                }
            });
    }

    private stopPolling(source: Source): void {
        this.polling[source]?.unsubscribe();
        delete this.polling[source];
    }

    private resetUser(): void {
        this.stopPolling('user');
        this._user.set({ loading: false, data: null });
    }
}
