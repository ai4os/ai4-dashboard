import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    FilterGroup,
    ModuleSummary,
} from '@app/shared/interfaces/module.interface';
import { ModulesService } from '../../services/modules-service/modules.service';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { ToolsService } from '../../services/tools-service/tools.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatTabGroup } from '@angular/material/tabs';

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
        private appConfigService: AppConfigService,
        private authService: AuthService,
        private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef
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

    modules: ModuleSummary[] = [];
    displayedModules: ModuleSummary[] = [];
    tools: ModuleSummary[] = [];
    displayedTools: ModuleSummary[] = [];

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
        this.getModulesSummaryFromService();
        this.getToolsSummary();
    }

    initializeForm() {
        this.searchFormGroup = this.fb.group({
            search: '',
        });
    }

    getModulesSummaryFromService() {
        this.isLoading = true;

        this.modulesService.getModulesSummary().subscribe({
            next: (modules) => {
                this.isLoading = false;
                this.modules = modules;
                const ai4eoscDevEnv = this.modules.find(
                    (m) => m.name === 'ai4os-dev-env'
                );
                if (ai4eoscDevEnv) {
                    this.modules = [
                        ...this.modules.filter(
                            (item) => item === ai4eoscDevEnv
                        ),
                        ...this.modules.filter(
                            (item) => item !== ai4eoscDevEnv
                        ),
                    ];
                }
                this.displayedModules = this.modules;

                this.librariesList = this.getFilters('libraries');
                this.tasksList = this.getFilters('tasks');
                this.categoriesList = this.getFilters('categories');
                this.datatypesList = this.getFilters('data-type');
                this.tagsList = this.getFilters('tags');
                this.resultsFound = this.displayedModules.length;
            },
            error: () => {
                setTimeout(() => (this.isLoading = false), 3000);
            },
        });
    }

    getToolsSummary() {
        this.isLoading = true;
        this.toolsService
            .getToolsSummary()
            .subscribe((tools: ModuleSummary[]) => {
                this.tools = tools;
                this.displayedTools = tools;
                this.librariesList = this.getFilters('libraries');
                this.tasksList = this.getFilters('tasks');
                this.categoriesList = this.getFilters('categories');
                this.datatypesList = this.getFilters('data-type');
                this.tagsList = this.getFilters('tags');
            });
    }

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }

    getNumResults(): number {
        let filteredList: ModuleSummary[] = [];

        if (this.tabGroup) {
            if (this.tabGroup.selectedIndex == 0) {
                filteredList = this.displayedModules;
            } else {
                filteredList = this.displayedTools;
            }

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
        }

        return filteredList.length;
    }

    getFilters(filter: string): Set<string> {
        let duplicatedOptions: string[] = [];
        let filteredOptions: string[] = [];

        if (this.tabGroup && this.modules && this.tools) {
            if (this.tabGroup.selectedIndex == 0) {
                this.modules.forEach((m) => {
                    let variable = m[filter];
                    if (variable !== undefined) {
                        duplicatedOptions = duplicatedOptions.concat(variable);
                    }
                });
            } else {
                this.tools.forEach((m) => {
                    let variable = m[filter];
                    if (variable !== undefined) {
                        duplicatedOptions = duplicatedOptions.concat(variable);
                    }
                });
            }

            filteredOptions = duplicatedOptions.filter(
                (option) => option !== 'Other'
            );
            if (duplicatedOptions.includes('Other')) {
                filteredOptions.push('Other');
            }
        }

        return new Set(filteredOptions);
    }

    addFilter(filter: FilterGroup) {
        this.selectedFilters.push(filter);
        this.updateFilters();
    }

    updateFilters() {
        let joinedFilteredModules = new Set<ModuleSummary>();
        let filteredModules: ModuleSummary[] = [];
        this.selectedFilters.forEach((filter) => {
            if (this.tabGroup && this.modules && this.tools) {
                if (this.tabGroup.selectedIndex == 0) {
                    filteredModules = this.modules;
                } else {
                    this.displayedTools = this.tools;
                }
            }
            // libraries filter
            if (filter.libraries.length > 0) {
                filteredModules = filteredModules.filter((m) =>
                    filter.libraries.some((lib) => m.libraries.includes(lib))
                );
                this.displayedTools = this.displayedTools.filter((m) =>
                    filter.libraries.some((lib) => m.libraries.includes(lib))
                );
            }
            // tasks filter
            if (filter.tasks.length > 0) {
                filteredModules = filteredModules.filter((m) =>
                    filter.tasks.some((task) => m.tasks.includes(task))
                );
                this.displayedTools = this.displayedTools.filter((m) =>
                    filter.tasks.some((task) => m.tasks.includes(task))
                );
            }
            // categories filter
            if (filter.categories.length > 0) {
                filteredModules = filteredModules.filter((m) =>
                    filter.categories.some((cat) => m.categories.includes(cat))
                );
                this.displayedTools = this.displayedTools.filter((m) =>
                    this.selectedCategories.some((cat) =>
                        m.categories.includes(cat)
                    )
                );
            }
            // datatypes filter
            if (filter.datatypes.length > 0) {
                filteredModules = filteredModules.filter((m) =>
                    filter.datatypes.some((dt) => m['data-type']?.includes(dt))
                );
                this.displayedTools = this.displayedTools.filter((m) =>
                    this.selectedDatatypes.some(
                        (dt) => m['data-type']?.includes(dt)
                    )
                );
            }
            // tags filter
            if (filter.tags.length > 0) {
                filteredModules = filteredModules.filter((m) =>
                    filter.tags.some((tag) => m.tags.includes(tag))
                );
                this.displayedTools = this.displayedTools.filter((m) =>
                    this.selectedTags.some((tag) => m.tags.includes(tag))
                );
            }

            joinedFilteredModules = new Set([
                ...joinedFilteredModules,
                ...filteredModules,
            ]);
        });
        this.displayedModules = Array.from(joinedFilteredModules);
        this.resultsFound = this.getNumResults();
    }

    resetFilters() {
        this.selectedLibraries = [];
        this.selectedTasks = [];
        this.selectedCategories = [];
        this.selectedDatatypes = [];
    }
}
