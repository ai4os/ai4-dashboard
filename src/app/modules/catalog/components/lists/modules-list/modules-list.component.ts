import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    computed,
    inject,
    signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';
import { UiLoaderComponent } from '@app/shared/components/ui/ui-loader/ui-loader.component';
import {
    Tab,
    UiTabsComponent,
} from '@app/shared/components/ui/ui-tabs/ui-tabs.component';
import { FilterGroup } from '@app/shared/interfaces/module.interface';
import { ModulesStore } from '@app/modules/catalog/store/modules.store';
import { CatalogListComponent } from '../catalog-list/catalog-list.component';
import { Ai4lifeListComponent } from './ai4life-list/ai4life-list.component';

const MOBILE_BREAKPOINT = '(max-width: 600px)';
const MARKETPLACE_STORAGE_KEY = 'selectedMarketplace';
const MODULES_FILTERS_STORAGE_KEY = 'selectedFilters';
const IMAGINE_VO = 'vo.imagine-ai.eu';

type MarketplaceTab = 'ai4eosc' | 'ai4life';

@Component({
    selector: 'app-modules-list',
    templateUrl: './modules-list.component.html',
    styleUrl: './modules-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatToolbar,
        MatIcon,
        CatalogListComponent,
        Ai4lifeListComponent,
        TranslatePipe,
        UiBannerComponent,
        UiLoaderComponent,
        UiTabsComponent,
    ],
})
export class ModulesListComponent implements OnInit {
    readonly store = inject(ModulesStore);
    private readonly breakpointObserver = inject(BreakpointObserver);
    private readonly appConfigService = inject(AppConfigService);

    readonly isMobile = toSignal(
        this.breakpointObserver
            .observe(MOBILE_BREAKPOINT)
            .pipe(map((state) => state.matches)),
        { initialValue: this.breakpointObserver.isMatched(MOBILE_BREAKPOINT) }
    );

    readonly modulesLoading = this.store.loading;
    readonly modulesError = this.store.error;

    readonly catalogStorageKey = MODULES_FILTERS_STORAGE_KEY;

    readonly ai4eoscElements = computed(() => {
        const modules = this.store.ai4eoscModules();
        if (this.appConfigService.voName !== IMAGINE_VO) return modules;
        return modules.filter((m) => m.id !== 'ai4os-llm');
    });

    readonly ai4eoscInitialFilters = computed<FilterGroup[]>(() => {
        if (this.appConfigService.voName !== IMAGINE_VO) return [];

        return [
            {
                libraries: [],
                tasks: [],
                categories: ['AI4 tools'],
                datatypes: [],
                tags: [],
            },
            {
                libraries: [],
                tasks: [],
                categories: [],
                datatypes: [],
                tags: [IMAGINE_VO],
            },
            {
                libraries: [],
                tasks: [],
                categories: [],
                datatypes: ['Image'],
                tags: ['general purpose'],
            },
        ];
    });

    readonly activeTab = signal<MarketplaceTab>(
        this.getStoredMarketplace() ?? 'ai4eosc'
    );

    readonly tabs: Tab[] = [
        {
            id: 'ai4eosc',
            label: 'CATALOG.MODULES.AI4EOSC-TAB',
            icon: 'model_training',
        },
        {
            id: 'ai4life',
            label: 'CATALOG.MODULES.AI4LIFE-TAB',
            icon: 'biotech',
        },
    ];

    ngOnInit(): void {
        this.store.ensureLoaded();
    }

    onTabSelected(tabId: string): void {
        const tab = tabId as MarketplaceTab;
        this.activeTab.set(tab);
        sessionStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(tab));
    }

    private getStoredMarketplace(): MarketplaceTab | null {
        const stored = sessionStorage.getItem(MARKETPLACE_STORAGE_KEY);
        if (!stored) return null;

        try {
            const parsed = JSON.parse(stored);
            return parsed === 'ai4eosc' || parsed === 'ai4life' ? parsed : null;
        } catch {
            return null;
        }
    }
}
