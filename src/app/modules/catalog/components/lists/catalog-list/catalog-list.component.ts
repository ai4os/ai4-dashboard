import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatChipSelectionChange } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { FiltersConfigurationDialogComponent } from '@app/modules/catalog/components/filters/filters-configuration-dialog/filters-configuration-dialog.component';
import {
    ModuleSummary,
    FilterGroup,
} from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-catalog-list',
    templateUrl: './catalog-list.component.html',
    styleUrl: './catalog-list.component.scss',
})
export class CatalogListComponent {
    constructor(
        private fb: FormBuilder,
        private appConfigService: AppConfigService,
        private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef,
        public dialog: MatDialog
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
        this.voName = this.appConfigService.voName;
    }
    @Input() elements: ModuleSummary[] = [];

    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;

    displayedElements: ModuleSummary[] = [];
    searchFormGroup!: FormGroup;
    resultsFound = 0;
    voName = '';

    // sorting
    sortBy = 'name';

    // options
    librariesList: Set<string> = new Set<string>();
    tasksList: Set<string> = new Set<string>();
    categoriesList: Set<string> = new Set<string>();
    datatypesList: Set<string> = new Set<string>();
    tagsList: Set<string> = new Set<string>();

    // applied filters
    selectedFilters: FilterGroup[] = [];
    selectedLibraries: string[] = [];
    selectedTasks: string[] = [];
    selectedCategories: string[] = [];
    selectedDatatypes: string[] = [];
    selectedTags: string[] = [];

    ngOnInit(): void {
        this.initializeForm();

        this.librariesList = this.getFilters('libraries');
        this.tasksList = this.getFilters('tasks');
        this.categoriesList = this.getFilters('categories');
        this.datatypesList = this.getFilters('data-type');
        this.tagsList = this.getFilters('tags');

        this.displayedElements = this.elements;
        this.resultsFound = this.displayedElements.length;
        this.orderElements();

        const previousSelectedFilters =
            sessionStorage.getItem('selectedFilters');
        if (previousSelectedFilters) {
            this.selectedFilters = JSON.parse(previousSelectedFilters);
            this.updateFilters();
        } else {
            this.applyInitialFilters();
        }
    }

    initializeForm() {
        this.searchFormGroup = this.fb.group({
            search: '',
        });
    }

    applyInitialFilters() {
        if (this.appConfigService.voName === 'vo.imagine-ai.eu') {
            this.addFilter({
                libraries: [],
                tasks: [],
                categories: [],
                datatypes: [],
                tags: ['vo.imagine-ai.eu'],
            });
            this.addFilter({
                libraries: [],
                tasks: [],
                categories: [],
                datatypes: ['Image'],
                tags: ['general purpose'],
            });
        }
    }

    getNumResults(): number {
        let filteredList = this.displayedElements;

        filteredList = filteredList.filter(
            (f) =>
                f.title
                    .toLocaleLowerCase()
                    .includes(
                        this.searchFormGroup.controls[
                            'search'
                        ].value.toLocaleLowerCase()
                    ) ||
                f.summary
                    .toLocaleLowerCase()
                    .includes(
                        this.searchFormGroup.controls[
                            'search'
                        ].value.toLocaleLowerCase()
                    )
        );

        return filteredList.length;
    }

    getFilters(filter: string): Set<string> {
        let options: string[] = [];
        const tagFrequencyMap: { [key: string]: number } = {};

        this.elements.forEach((m) => {
            const variables = m[filter];
            if (variables !== undefined) {
                if (filter === 'tags') {
                    variables.forEach((v: string) => {
                        if (tagFrequencyMap[v]) {
                            tagFrequencyMap[v]++;
                        } else {
                            tagFrequencyMap[v] = 1;
                        }
                    });
                } else {
                    options = options.concat(variables);
                }
            }
        });

        if (options.includes('Other')) {
            options = options.filter((option) => option !== 'Other');
            options.push('Other');
        }

        if (filter === 'tags') {
            // order tags by frequency
            options = Object.keys(tagFrequencyMap).sort((a, b) => {
                return tagFrequencyMap[b] - tagFrequencyMap[a];
            });
        }

        return new Set(options);
    }

    addFilter(filter: FilterGroup) {
        if (filter) {
            this.selectedFilters.push(filter);
        }
        this.resetFilters();
        this.updateFilters();
    }

    updateFilters() {
        let joinedFilteredElements = new Set<ModuleSummary>();
        let dynamicFilteredElements: ModuleSummary[] = [];
        let staticFilteredElements: ModuleSummary[] = [];

        // filter by static filters
        if (this.selectedFilters.length > 0) {
            this.selectedFilters.forEach((filter) => {
                staticFilteredElements = this.elements;
                // libraries filter
                if (filter.libraries.length > 0) {
                    staticFilteredElements = staticFilteredElements.filter(
                        (m) =>
                            filter.libraries.some((lib) =>
                                m.libraries.includes(lib)
                            )
                    );
                }

                // tasks filter
                if (filter.tasks.length > 0) {
                    staticFilteredElements = staticFilteredElements.filter(
                        (m) =>
                            filter.tasks.some((task) => m.tasks.includes(task))
                    );
                }

                // categories filter
                if (filter.categories.length > 0) {
                    staticFilteredElements = staticFilteredElements.filter(
                        (m) =>
                            filter.categories.some((cat) =>
                                m.categories.includes(cat)
                            )
                    );
                }
                // datatypes filter
                if (filter.datatypes.length > 0) {
                    staticFilteredElements = staticFilteredElements.filter(
                        (m) =>
                            filter.datatypes.some((dt) =>
                                m['data-type']?.includes(dt)
                            )
                    );
                }
                // tags filter
                if (filter.tags.length > 0) {
                    staticFilteredElements = staticFilteredElements.filter(
                        (m) => filter.tags.some((tag) => m.tags.includes(tag))
                    );
                }

                joinedFilteredElements = new Set([
                    ...joinedFilteredElements,
                    ...staticFilteredElements,
                ]);
            });
        } else {
            joinedFilteredElements = new Set([
                ...joinedFilteredElements,
                ...this.elements,
            ]);
        }

        if (
            this.selectedLibraries.length !== 0 ||
            this.selectedTasks.length !== 0 ||
            this.selectedCategories.length !== 0 ||
            this.selectedDatatypes.length !== 0 ||
            this.selectedTags.length !== 0
        ) {
            dynamicFilteredElements = this.elements;
        }

        // filter by dynamic filters
        // libraries filter
        if (this.selectedLibraries.length > 0) {
            dynamicFilteredElements = dynamicFilteredElements.filter((m) =>
                this.selectedLibraries.some((lib) => m.libraries.includes(lib))
            );
        }
        // tasks filter
        if (this.selectedTasks.length > 0) {
            dynamicFilteredElements = dynamicFilteredElements.filter((m) =>
                this.selectedTasks.some((task) => m.tasks.includes(task))
            );
        }
        // categories filter
        if (this.selectedCategories.length > 0) {
            dynamicFilteredElements = dynamicFilteredElements.filter((m) =>
                this.selectedCategories.some((cat) =>
                    m.categories.includes(cat)
                )
            );
        }
        // datatypes filter
        if (this.selectedDatatypes.length > 0) {
            dynamicFilteredElements = dynamicFilteredElements.filter((m) =>
                this.selectedDatatypes.some((dt) =>
                    m['data-type']?.includes(dt)
                )
            );
        }
        // tags filter
        if (this.selectedTags.length > 0) {
            dynamicFilteredElements = dynamicFilteredElements.filter((m) =>
                this.selectedTags.some((tag) => m.tags.includes(tag))
            );
        }

        if (this.selectedFilters.length === 0) {
            if (
                this.selectedLibraries.length === 0 &&
                this.selectedTasks.length === 0 &&
                this.selectedCategories.length === 0 &&
                this.selectedDatatypes.length === 0 &&
                this.selectedTags.length === 0
            ) {
                // if no filters are selected, show all elements
                joinedFilteredElements = new Set([...this.elements]);
            } else {
                // if only dynamic filters are selected, filter by dynamic filters
                joinedFilteredElements = new Set([...dynamicFilteredElements]);
            }
        } else {
            // if static filters are selected, filter by static and dynamic filters
            joinedFilteredElements = new Set([
                ...joinedFilteredElements,
                ...dynamicFilteredElements,
            ]);
        }

        this.displayedElements = Array.from(joinedFilteredElements);
        this.orderElements();
        this.resultsFound = this.getNumResults();
    }

    openFiltersConfiguration(): void {
        const dialogRef = this.dialog.open(
            FiltersConfigurationDialogComponent,
            {
                disableClose: true,
                data: this.selectedFilters,
            }
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.selectedFilters = result;
                this.updateFilters();
            }
        });
    }

    orderElements() {
        // sort by name
        if (this.sortBy === 'name') {
            this.displayedElements.sort((a, b) => {
                return a.title.localeCompare(b.title);
            });
        }

        // order by most recent
        if (this.sortBy === 'recent') {
            this.displayedElements.sort((a, b) => {
                // handle cases where dates are missing
                if (a.dates === undefined) return 1;
                if (b.dates === undefined) return -1;

                const dateA = new Date(a.dates.updated).getTime();
                const dateB = new Date(b.dates.updated).getTime();

                // handle cases where updated dates are invalid or missing
                if (isNaN(dateA)) return 1;
                if (isNaN(dateB)) return -1;

                return dateB - dateA;
            });
        }
    }

    resetFilters() {
        this.selectedLibraries = [];
        this.selectedTasks = [];
        this.selectedCategories = [];
        this.selectedDatatypes = [];
        this.selectedTags = [];
    }

    filterByLibrary(libraries: string[]) {
        this.selectedLibraries = libraries;
        this.updateFilters();
    }

    filterByTask(tasks: string[]) {
        this.selectedTasks = tasks;
        this.updateFilters();
    }

    filterByCategory(categories: string[]) {
        this.selectedCategories = categories;
        this.updateFilters();
    }

    filterByDatatype(datatypes: string[]) {
        this.selectedDatatypes = datatypes;
        this.updateFilters();
    }

    filterByTag(tags: string[]) {
        this.selectedTags = tags;
        this.updateFilters();
    }

    selectedSortingChip(event: MatChipSelectionChange) {
        const selectedChipValue = event.source.value;

        if (!event.selected && selectedChipValue === this.sortBy) {
            event.source.select();
            return;
        }

        if (event.selected) {
            if (selectedChipValue === 'name') {
                this.sortBy = 'name';
            } else if (selectedChipValue === 'recent') {
                this.sortBy = 'recent';
            }

            this.orderElements();
        }
    }

    ngOnDestroy(): void {
        sessionStorage.setItem(
            'selectedFilters',
            JSON.stringify(this.selectedFilters)
        );
    }
}
