import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';
import {
    UiTabsComponent,
    Tab,
} from '@app/shared/components/ui/ui-tabs/ui-tabs.component';
import { UiLoaderComponent } from '@app/shared/components/ui/ui-loader/ui-loader.component';
import { QueryTabsPage } from '@app/modules/statistics/query-tabs.page';
import { StatsStore } from '@app/modules/statistics/store/stats.store';
import { UserFootprintTabComponent } from '../user-footprint-tab/user-footprint-tab.component';
import { UserUsageTabComponent } from '../user-usage-tab/user-usage-tab.component';

@Component({
    selector: 'app-user-stats',
    templateUrl: './user-stats.component.html',
    styleUrls: ['./user-stats.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        UiBannerComponent,
        UiTabsComponent,
        UiLoaderComponent,
        UserUsageTabComponent,
        UserFootprintTabComponent,
        TranslatePipe,
    ],
})
export class UserStatsComponent extends QueryTabsPage implements OnInit {
    private readonly store = inject(StatsStore);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);

    readonly tabs: Tab[] = [
        {
            id: 'usage',
            label: 'STATS.USER.USAGE.TITLE',
            icon: 'bar_chart',
        },
        {
            id: 'footprint',
            label: 'STATS.USER.FOOTPRINT.TITLE',
            icon: 'eco',
        },
    ];

    readonly user = this.store.user;

    ngOnInit(): void {
        // sin sesión no hay datos de usuario: redirigimos a Platform
        if (!this.authService.isAuthenticated()) {
            void this.router.navigate(['/statistics/platform'], {
                replaceUrl: true,
            });
            return;
        }

        this.syncTabWithUrl();

        this.destroyRef.onDestroy(this.store.connectUser());
    }
}
