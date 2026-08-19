import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    computed,
    inject,
    signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { debounceTime, map, startWith } from 'rxjs/operators';

import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';
import { UiTextFieldComponent } from '@app/shared/components/ui/ui-text-field/ui-text-field.component';
import {
    UiSelectComponent,
    SelectOption,
} from '@app/shared/components/ui/ui-select/ui-select.component';
import { LlmCardComponent } from '../../modules-cards/llm-card/llm-card.component';
import { UiLoaderComponent } from '@app/shared/components/ui/ui-loader/ui-loader.component';
import {
    Tab,
    UiTabsComponent,
} from '@app/shared/components/ui/ui-tabs/ui-tabs.component';
import { LlmsStore } from '@app/modules/catalog/store/llms.store';

const ALL_FAMILIES = 'ALL' as const;
const MOBILE_BREAKPOINT = '(max-width: 600px)';
const SEARCH_DEBOUNCE_MS = 250;

@Component({
    selector: 'app-llms-list',
    templateUrl: './llms-list.component.html',
    styleUrl: './llms-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatToolbar,
        MatIcon,
        ReactiveFormsModule,
        UiTextFieldComponent,
        UiSelectComponent,
        LlmCardComponent,
        TranslatePipe,
        UiBannerComponent,
        UiLoaderComponent,
        UiTabsComponent,
    ],
})
export class LlmsListComponent implements OnInit {
    store = inject(LlmsStore);
    private readonly fb = inject(FormBuilder);
    private readonly breakpointObserver = inject(BreakpointObserver);
    private readonly translate = inject(TranslateService);

    readonly dialog = inject(MatDialog);
    readonly allFamiliesOption = ALL_FAMILIES;

    readonly filtersForm = this.fb.nonNullable.group({
        search: '',
        family: ALL_FAMILIES as string,
    });

    readonly isMobile = toSignal(
        this.breakpointObserver
            .observe(MOBILE_BREAKPOINT)
            .pipe(map((state) => state.matches)),
        { initialValue: this.breakpointObserver.isMatched(MOBILE_BREAKPOINT) }
    );

    private readonly searchTerm = toSignal(
        this.filtersForm.controls.search.valueChanges.pipe(
            startWith(this.filtersForm.controls.search.value),
            debounceTime(SEARCH_DEBOUNCE_MS)
        ),
        { initialValue: this.filtersForm.controls.search.value }
    );

    private readonly selectedFamily = toSignal(
        this.filtersForm.controls.family.valueChanges.pipe(
            startWith(this.filtersForm.controls.family.value)
        ),
        { initialValue: this.filtersForm.controls.family.value }
    );

    private readonly allFamiliesLabel = toSignal(
        this.translate.onLangChange.pipe(
            startWith(null),
            map(() => this.translate.instant('CATALOG.LLMS.ALL'))
        ),
        { initialValue: this.translate.instant('CATALOG.LLMS.ALL') }
    );

    readonly selfLlms = this.store.selfLlms;
    readonly platformLlms = this.store.platformLlms;

    readonly activeTab = signal<string>('platform-wide');
    readonly llmsLoading = this.store.loading;
    readonly llmsError = this.store.error;

    readonly activeLlms = computed(() =>
        this.activeTab() === 'platform-wide'
            ? this.platformLlms()
            : this.selfLlms()
    );

    readonly families = computed(() => {
        const uniqueFamilies = new Set(
            this.activeLlms().map((llm) => llm.family)
        );
        return [...uniqueFamilies].sort((a, b) => a.localeCompare(b));
    });

    readonly familyOptions = computed<SelectOption[]>(() => [
        { value: ALL_FAMILIES, viewValue: this.allFamiliesLabel() },
        ...this.families().map((family) => ({
            value: family,
            viewValue: family,
        })),
    ]);

    readonly filteredLlms = computed(() => {
        const search = this.searchTerm().trim().toLowerCase();
        const family = this.selectedFamily();

        return this.activeLlms().filter((llm) => {
            const matchesFamily =
                family === ALL_FAMILIES || llm.family === family;
            const matchesSearch =
                !search ||
                llm.name?.toLowerCase().includes(search) ||
                llm.description?.toLowerCase().includes(search);
            return matchesFamily && matchesSearch;
        });
    });

    readonly resultsFound = computed(() => this.filteredLlms().length);

    get tabs(): Tab[] {
        return [
            {
                id: 'platform-wide',
                label: 'CATALOG.LLMS.PLATFORM-WIDE-TAB',
                icon: 'cloud',
            },
            {
                id: 'self-deployed',
                label: 'CATALOG.LLMS.SELF-DEPLOYED-TAB',
                icon: 'dns',
            },
        ];
    }

    onTabSelected(tabId: string) {
        this.activeTab.set(tabId);
    }

    ngOnInit(): void {
        this.store.ensureLoaded();
    }
}
