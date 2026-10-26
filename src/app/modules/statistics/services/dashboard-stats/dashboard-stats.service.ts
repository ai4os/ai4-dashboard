import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { StatsService } from '../stats/stats.service';
import {
    LoadState,
    ClusterViewModel,
    UserViewModel,
} from '@app/shared/models/stats.view-models';
import { mapCluster, mapUser } from '../../stats.mapper';

function toLoadState<T>(
    source$: Observable<T | null>
): Observable<LoadState<T>> {
    return source$.pipe(
        map((data): LoadState<T> => ({ loading: false, data })),
        catchError(() => of<LoadState<T>>({ loading: false, data: null })),
        startWith<LoadState<T>>({ loading: true, data: null })
    );
}

@Injectable({ providedIn: 'root' })
export class DashboardStatsService {
    private readonly statsService = inject(StatsService);

    loadCluster(): Observable<LoadState<ClusterViewModel>> {
        return toLoadState(
            this.statsService.getClusterStats().pipe(map(mapCluster))
        );
    }

    loadUser(): Observable<LoadState<UserViewModel>> {
        return toLoadState(this.statsService.getUserStats().pipe(map(mapUser)));
    }
}
