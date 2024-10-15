import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    FilterGroup,
    ModuleSummary,
} from '@app/shared/interfaces/module.interface';
import { ModulesService } from '../../services/modules-service/modules.service';
import { ToolsService } from '../../services/tools-service/tools.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { FiltersConfigurationDialogComponent } from '../filters/filters-configuration-dialog/filters-configuration-dialog.component';
import { forkJoin } from 'rxjs';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';

@Component({
    selector: 'app-modules-list',
    templateUrl: './modules-list.component.html',
    styleUrls: ['./modules-list.component.scss'],
})
export class ModulesListComponent implements OnInit, OnDestroy {
    constructor(
        private fb: FormBuilder,
        private modulesService: ModulesService,
        private toolsService: ToolsService,
        private appConfigService: AppConfigService,
        private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef,
        public dialog: MatDialog
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }
    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    searchFormGroup!: FormGroup;
    isLoading = false;

    elements: ModuleSummary[] = [];
    displayedElements: ModuleSummary[] = [];
    resultsFound = 0;

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
        this.isLoading = true;
        this.initializeForm();

        forkJoin({
            modules: this.modulesService.getModulesSummary(),
            tools: this.toolsService.getToolsSummary(),
        }).subscribe({
            next: (result) => {
                this.elements = this.elements
                    .concat(result.tools)
                    .concat(result.modules);

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

                this.isLoading = false;
            },
            error: () => {
                setTimeout(() => (this.isLoading = false), 3000);
            },
        });
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
                categories: ['AI4 tools'],
                datatypes: [],
                tags: [],
            });
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
            let variables = m[filter];
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
                            filter.datatypes.some(
                                (dt) => m['data-type']?.includes(dt)
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
                this.selectedDatatypes.some(
                    (dt) => m['data-type']?.includes(dt)
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
        // TODO: delete this first part when the AI4OS Dev Env is returned in /tools/detail
        // Put the tools that are returned in /modules at the top of the list
        const tools = this.displayedElements.filter((m) =>
            m.categories.includes('AI4 tools')
        );
        if (tools) {
            this.displayedElements = [
                ...this.displayedElements.filter((item) =>
                    tools.includes(item)
                ),
                ...this.displayedElements.filter(
                    (item) => !tools.includes(item)
                ),
            ];
        }

        // Put the AI4OS Dev Env on top of the list
        this.displayedElements = [
            ...this.displayedElements.filter(
                (item) => item.name === 'ai4os-dev-env'
            ),
            ...this.displayedElements.filter(
                (item) => item.name !== 'ai4os-dev-env'
            ),
        ];
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

    ngOnDestroy(): void {
        sessionStorage.setItem(
            'selectedFilters',
            JSON.stringify(this.selectedFilters)
        );
    }
}
