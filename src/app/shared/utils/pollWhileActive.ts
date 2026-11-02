import { exhaustMap, Observable, takeUntil, timer } from 'rxjs';

export function pollWhileActive<T>(
    request: () => Observable<T>,
    stop$: Observable<unknown>,
    intervalMs = 5000
): Observable<T> {
    return timer(0, intervalMs).pipe(takeUntil(stop$), exhaustMap(request));
}
