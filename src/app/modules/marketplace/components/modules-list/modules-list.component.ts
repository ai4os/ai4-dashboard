import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    FilterGroup,
    ModuleSummary,
} from '@app/shared/interfaces/module.interface';
import { ModulesService } from '../../services/modules-service/modules.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { ToolsService } from '../../services/tools-service/tools.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatTabGroup } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { FiltersConfigurationDialogComponent } from './filters-configuration-dialog/filters-configuration-dialog.component';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-modules-list',
    templateUrl: './modules-list.component.html',
    styleUrls: ['./modules-list.component.scss'],
})
export class ModulesListComponent implements OnInit {
    constructor(
        private fb: FormBuilder,
        private modulesService: ModulesService,
        private toolsService: ToolsService,
        private authService: AuthService,
        private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef,
        public dialog: MatDialog
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    @ViewChild('tabGroup')
    tabGroup!: MatTabGroup;

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
        this.initializeForm();
        this.isLoading = true;

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

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
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

        this.elements.forEach((m) => {
            let variable = m[filter];
            if (variable !== undefined) {
                options = options.concat(variable);
            }
        });

        if (options.includes('Other')) {
            options = options.filter((option) => option !== 'Other');
            options.push('Other');
        }

        return new Set(options);
    }

    addFilter(filter: FilterGroup) {
        this.selectedFilters.push(filter);
        this.updateFilters();
    }

    updateFilters() {
        let joinedFilteredElements = new Set<ModuleSummary>();
        let filteredElements: ModuleSummary[] = [];

        if (this.selectedFilters.length > 0) {
            this.selectedFilters.forEach((filter) => {
                filteredElements = this.elements;
                // libraries filter
                if (filter.libraries.length > 0) {
                    filteredElements = filteredElements.filter((m) =>
                        filter.libraries.some((lib) =>
                            m.libraries.includes(lib)
                        )
                    );
                }
                // tasks filter
                if (filter.tasks.length > 0) {
                    filteredElements = filteredElements.filter((m) =>
                        filter.tasks.some((task) => m.tasks.includes(task))
                    );
                }
                // categories filter
                if (filter.categories.length > 0) {
                    filteredElements = filteredElements.filter((m) =>
                        filter.categories.some((cat) =>
                            m.categories.includes(cat)
                        )
                    );
                }
                // datatypes filter
                if (filter.datatypes.length > 0) {
                    filteredElements = filteredElements.filter((m) =>
                        filter.datatypes.some(
                            (dt) => m['data-type']?.includes(dt)
                        )
                    );
                }
                // tags filter
                if (filter.tags.length > 0) {
                    filteredElements = filteredElements.filter((m) =>
                        filter.tags.some((tag) => m.tags.includes(tag))
                    );
                }

                joinedFilteredElements = new Set([
                    ...joinedFilteredElements,
                    ...filteredElements,
                ]);
            });

            this.displayedElements = Array.from(joinedFilteredElements);
        } else {
            this.displayedElements = this.elements;
        }
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

        // Put the AI4OS Dev Env at the top of the list
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
    }
}
