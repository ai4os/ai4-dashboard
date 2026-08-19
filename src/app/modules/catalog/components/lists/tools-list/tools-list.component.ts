import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    computed,
    inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { ToolsStore } from '@app/modules/catalog/store/tools.store';
import { CatalogListComponent } from '../catalog-list/catalog-list.component';
import { FilterGroup } from '@app/shared/interfaces/module.interface';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';

const MOBILE_BREAKPOINT = '(max-width: 600px)';
const TOOLS_FILTERS_STORAGE_KEY = 'selectedFiltersTools';
const IMAGINE_VO = 'vo.imagine-ai.eu';

@Component({
    selector: 'app-tools-list',
    templateUrl: './tools-list.component.html',
    styleUrl: './tools-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatToolbar,
        MatIcon,
        CatalogListComponent,
        TranslatePipe,
        UiBannerComponent,
    ],
})
export class ToolsListComponent implements OnInit {
    readonly store = inject(ToolsStore);
    private readonly breakpointObserver = inject(BreakpointObserver);
    private readonly appConfigService = inject(AppConfigService);

    readonly isMobile = toSignal(
        this.breakpointObserver
            .observe(MOBILE_BREAKPOINT)
            .pipe(map((state) => state.matches)),
        { initialValue: this.breakpointObserver.isMatched(MOBILE_BREAKPOINT) }
    );

    readonly toolsLoading = this.store.loading;
    readonly toolsError = this.store.error;

    readonly catalogStorageKey = TOOLS_FILTERS_STORAGE_KEY;

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

    ngOnInit(): void {
        this.store.ensureLoaded();
    }
}
