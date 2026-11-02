import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Tab } from '@app/shared/components/ui/ui-tabs/ui-tabs.component';

export abstract class QueryTabsPage {
    private readonly tabsRoute = inject(ActivatedRoute);
    private readonly tabsRouter = inject(Router);
    private readonly tabsDestroyRef = inject(DestroyRef);

    abstract readonly tabs: Tab[];

    activeTabId = '';

    protected syncTabWithUrl(): void {
        this.tabsRoute.queryParamMap
            .pipe(takeUntilDestroyed(this.tabsDestroyRef))
            .subscribe((params) => {
                const requested = params.get('tab');
                this.activeTabId = this.tabs.some((t) => t.id === requested)
                    ? (requested as string)
                    : this.tabs[0].id;
            });
    }

    onTabChange(id: string): void {
        this.activeTabId = id;
        void this.tabsRouter.navigate([], {
            relativeTo: this.tabsRoute,
            queryParams: { tab: id },
            queryParamsHandling: 'merge',
            replaceUrl: true,
        });
    }
}
