import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    OnInit,
    computed,
    effect,
    inject,
    input,
    signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatBadge } from '@angular/material/badge';
import { MatDivider } from '@angular/material/divider';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { FiltersConfigurationDialogComponent } from '@app/modules/catalog/components/filters/filters-configuration-dialog/filters-configuration-dialog.component';
import {
    ModuleSummary,
    FilterGroup,
} from '@app/shared/interfaces/module.interface';
import { UiTextFieldComponent } from '@app/shared/components/ui/ui-text-field/ui-text-field.component';
import { UiLoaderComponent } from '@app/shared/components/ui/ui-loader/ui-loader.component';
import { FilterComponentComponent } from '../../filters/filter-component/filter-component.component';
import { Ai4eoscModuleCardComponent } from '../../modules-cards/ai4eosc-module-card/ai4eosc-module-card.component';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';
import { SelectOption } from '@app/shared/components/ui/ui-select/ui-select.component';

type SortBy = 'name' | 'recent';

const MOBILE_BREAKPOINT = '(max-width: 600px)';
const SEARCH_DEBOUNCE_MS = 250;
const PAGE_SIZE = 16;
const SESSION_STORAGE_KEY = 'selectedFilters';

@Component({
    selector: 'app-catalog-list',
    templateUrl: './catalog-list.component.html',
    styleUrl: './catalog-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatToolbar,
        ReactiveFormsModule,
        MatIcon,
        MatBadge,
        MatDivider,
        MatPaginator,
        FilterComponentComponent,
        Ai4eoscModuleCardComponent,
        UiTextFieldComponent,
        UiLoaderComponent,
        TranslatePipe,
        FormsModule,
        UiButtonComponent,
    ],
})
export class CatalogListComponent implements OnInit {
    // Data source: the parent (modules-list, tools-list, ...) owns the
    // store/service call and just feeds the resulting elements + status here.
    readonly elements = input.required<ModuleSummary[]>();
    readonly loading = input<boolean>(false);
    readonly error = input<boolean>(false);

    // Each consumer keeps its own "additional filters" state isolated in
    // sessionStorage (otherwise modules and tools would overwrite each other).
    readonly storageKey = input<string>(SESSION_STORAGE_KEY);

    private readonly fb = inject(FormBuilder);
    private readonly breakpointObserver = inject(BreakpointObserver);
    private readonly destroyRef = inject(DestroyRef);
    private readonly translate = inject(TranslateService);

    readonly dialog = inject(MatDialog);

    readonly isMobile = toSignal(
        this.breakpointObserver
            .observe(MOBILE_BREAKPOINT)
            .pipe(map((state) => state.matches)),
        { initialValue: this.breakpointObserver.isMatched(MOBILE_BREAKPOINT) }
    );

    readonly filtersForm = this.fb.nonNullable.group({
        search: '',
    });

    private readonly searchTerm = toSignal(
        this.filtersForm.controls.search.valueChanges.pipe(
            startWith(this.filtersForm.controls.search.value),
            debounceTime(SEARCH_DEBOUNCE_MS)
        ),
        { initialValue: this.filtersForm.controls.search.value }
    );

    readonly sortBy = signal<SortBy>('name');

    // Optional default set of "additional filters" a parent can request the
    // first time the list loads (e.g. VO-specific defaults). Replaces the
    // hard-coded IMAGINE_VO logic that used to live in this component.
    readonly initialFilters = input<FilterGroup[]>([]);

    // "additional filters" applied through the filters dialog (OR'd together)
    readonly selectedFilters = signal<FilterGroup[]>([]);

    // inline dynamic filters (AND'd together)
    readonly selectedLibraries = signal<string[]>([]);
    readonly selectedTasks = signal<string[]>([]);
    readonly selectedCategories = signal<string[]>([]);
    readonly selectedDatatypes = signal<string[]>([]);
    readonly selectedTags = signal<string[]>([]);

    readonly sortOptions: SelectOption[] = [
        {
            value: 'name',
            viewValue: this.translate.instant('CATALOG.SORTING.NAME'),
        },
        {
            value: 'recent',
            viewValue: this.translate.instant('CATALOG.SORTING.MOST-RECENT'),
        },
    ];

    readonly pageIndex = signal(0);
    readonly pageSize = PAGE_SIZE;

    readonly librariesList = computed(() => this.getFilterOptions('libraries'));
    readonly tasksList = computed(() => this.getFilterOptions('tasks'));
    readonly categoriesList = computed(() =>
        this.getFilterOptions('categories')
    );
    readonly datatypesList = computed(() => this.getFilterOptions('data-type'));
    readonly tagsList = computed(() => this.getFilterOptions('tags', true));

    readonly filteredElements = computed(() => {
        const search = this.searchTerm().trim().toLowerCase();
        const filtered = this.applyFilters(this.elements());

        if (!search) return filtered;

        return filtered.filter(
            (m) =>
                m.title?.toLowerCase().includes(search) ||
                m.summary?.toLowerCase().includes(search)
        );
    });

    readonly sortedElements = computed(() => {
        const sortBy = this.sortBy();
        const elements = [...this.filteredElements()];

        if (sortBy === 'name') {
            return elements.sort((a, b) => a.title.localeCompare(b.title));
        }

        return elements.sort((a, b) => {
            if (a.dates === undefined) return 1;
            if (b.dates === undefined) return -1;

            const dateA = new Date(a.dates.updated).getTime();
            const dateB = new Date(b.dates.updated).getTime();

            if (isNaN(dateA)) return 1;
            if (isNaN(dateB)) return -1;

            return dateB - dateA;
        });
    });

    readonly resultsFound = computed(() => this.sortedElements().length);

    readonly pagedElements = computed(() => {
        const start = this.pageIndex() * this.pageSize;
        return this.sortedElements().slice(start, start + this.pageSize);
    });
    constructor() {
        // reset pagination whenever the filtered/sorted result set changes
        effect(
            () => {
                this.sortedElements();
                this.pageIndex.set(0);
            },
            { allowSignalWrites: true }
        );

        this.destroyRef.onDestroy(() => {
            sessionStorage.setItem(
                this.storageKey(),
                JSON.stringify(this.selectedFilters())
            );
        });
    }

    ngOnInit(): void {
        const previousSelectedFilters = sessionStorage.getItem(
            this.storageKey()
        );
        const parsedFilters: FilterGroup[] = previousSelectedFilters
            ? JSON.parse(previousSelectedFilters)
            : [];

        if (parsedFilters.length > 0) {
            this.selectedFilters.set(parsedFilters);
        } else {
            this.applyInitialFilters();
        }
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex.set(event.pageIndex);
    }

    toggleSort(): void {
        this.sortBy.update((current) =>
            current === 'name' ? 'recent' : 'name'
        );
    }
    onSortChange(sortValue: SortBy): void {
        this.sortBy.set(sortValue);
    }

    addFilter(filter: FilterGroup): void {
        if (filter) {
            this.selectedFilters.update((filters) => [...filters, filter]);
        }
        this.resetDynamicFilters();
    }

    filterByLibrary(libraries: string[]): void {
        this.selectedLibraries.set(libraries);
    }

    filterByTask(tasks: string[]): void {
        this.selectedTasks.set(tasks);
    }

    filterByCategory(categories: string[]): void {
        this.selectedCategories.set(categories);
    }

    filterByDatatype(datatypes: string[]): void {
        this.selectedDatatypes.set(datatypes);
    }

    filterByTag(tags: string[]): void {
        this.selectedTags.set(tags);
    }

    openFiltersConfiguration(): void {
        const dialogRef = this.dialog.open(
            FiltersConfigurationDialogComponent,
            {
                disableClose: true,
                data: this.selectedFilters(),
                panelClass: 'ui-dialog-panel',
            }
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.selectedFilters.set(result);
            }
        });
    }

    private resetDynamicFilters(): void {
        this.selectedLibraries.set([]);
        this.selectedTasks.set([]);
        this.selectedCategories.set([]);
        this.selectedDatatypes.set([]);
        this.selectedTags.set([]);
    }

    private applyInitialFilters(): void {
        if (this.initialFilters().length === 0) return;
        this.selectedFilters.set(this.initialFilters());
    }

    private applyFilters(elements: ModuleSummary[]): ModuleSummary[] {
        const staticFilters = this.selectedFilters();
        const dynamicFacets = {
            libraries: this.selectedLibraries(),
            tasks: this.selectedTasks(),
            categories: this.selectedCategories(),
            datatypes: this.selectedDatatypes(),
            tags: this.selectedTags(),
        };
        const hasDynamicFacets = Object.values(dynamicFacets).some(
            (values) => values.length > 0
        );

        const staticResult = new Set<ModuleSummary>();
        if (staticFilters.length > 0) {
            staticFilters.forEach((filter) => {
                this.matchStaticFilter(elements, filter).forEach((m) =>
                    staticResult.add(m)
                );
            });
        }

        let dynamicResult: ModuleSummary[] = [];
        if (hasDynamicFacets) {
            dynamicResult = this.matchDynamicFacets(elements, dynamicFacets);
        }

        if (staticFilters.length === 0 && !hasDynamicFacets) {
            return elements;
        }
        if (staticFilters.length === 0) {
            return dynamicResult;
        }

        return Array.from(new Set([...staticResult, ...dynamicResult]));
    }

    private matchStaticFilter(
        elements: ModuleSummary[],
        filter: FilterGroup
    ): ModuleSummary[] {
        let result = elements;

        if (filter.libraries.length > 0) {
            result = result.filter((m) =>
                filter.libraries.some((lib) => m.libraries.includes(lib))
            );
        }
        if (filter.tasks.length > 0) {
            result = result.filter((m) =>
                filter.tasks.some((task) => m.tasks.includes(task))
            );
        }
        if (filter.categories.length > 0) {
            result = result.filter((m) =>
                filter.categories.some((cat) => m.categories.includes(cat))
            );
        }
        if (filter.datatypes.length > 0) {
            result = result.filter((m) =>
                filter.datatypes.some((dt) => m['data-type']?.includes(dt))
            );
        }
        if (filter.tags.length > 0) {
            result = result.filter((m) =>
                filter.tags.some((tag) => m.tags.includes(tag))
            );
        }

        return result;
    }

    private matchDynamicFacets(
        elements: ModuleSummary[],
        facets: {
            libraries: string[];
            tasks: string[];
            categories: string[];
            datatypes: string[];
            tags: string[];
        }
    ): ModuleSummary[] {
        let result = elements;

        if (facets.libraries.length > 0) {
            result = result.filter((m) =>
                facets.libraries.some((lib) => m.libraries.includes(lib))
            );
        }
        if (facets.tasks.length > 0) {
            result = result.filter((m) =>
                facets.tasks.some((task) => m.tasks.includes(task))
            );
        }
        if (facets.categories.length > 0) {
            result = result.filter((m) =>
                facets.categories.some((cat) => m.categories.includes(cat))
            );
        }
        if (facets.datatypes.length > 0) {
            result = result.filter((m) =>
                facets.datatypes.some((dt) => m['data-type']?.includes(dt))
            );
        }
        if (facets.tags.length > 0) {
            result = result.filter((m) =>
                facets.tags.some((tag) => m.tags.includes(tag))
            );
        }

        return result;
    }

    private getFilterOptions(
        filter: string,
        sortByFrequency = false
    ): Set<string> {
        let options: string[] = [];
        const frequencyMap: Record<string, number> = {};

        this.elements().forEach((m) => {
            const values = m[filter];
            if (values === undefined) return;

            if (sortByFrequency) {
                values.forEach((v: string) => {
                    frequencyMap[v] = (frequencyMap[v] ?? 0) + 1;
                });
            } else {
                options = options.concat(values);
            }
        });

        if (sortByFrequency) {
            const sorted = Object.keys(frequencyMap).sort(
                (a, b) => frequencyMap[b] - frequencyMap[a]
            );
            return new Set(sorted);
        }

        if (options.includes('Other')) {
            options = [
                ...options.filter((option) => option !== 'Other'),
                'Other',
            ];
        }
        return new Set(options);
    }
}
