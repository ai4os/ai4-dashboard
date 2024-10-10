import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModuleSummary } from '@app/shared/interfaces/module.interface';
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
    filteredModules: ModuleSummary[] = [];
    tools: ModuleSummary[] = [];
    filteredTools: ModuleSummary[] = [];

    resultsFound = 0;

    // options
    librariesList: Set<string> = new Set<string>();
    tasksList: Set<string> = new Set<string>();
    categoriesList: Set<string> = new Set<string>();
    datatypesList: Set<string> = new Set<string>();
    tagsList: Set<string> = new Set<string>();

    // applied filters
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
                this.filteredModules = this.modules;

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

                this.librariesList = this.getFilters('libraries');
                this.tasksList = this.getFilters('tasks');
                this.categoriesList = this.getFilters('categories');
                this.datatypesList = this.getFilters('data-type');
                this.tagsList = this.getFilters('tags');
                this.resultsFound = this.filteredModules.length;
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
                this.filteredTools = tools;
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
                filteredList = this.filteredModules;
            } else {
                filteredList = this.filteredTools;
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

    updateFilters() {
        if (this.tabGroup && this.modules && this.tools) {
            if (this.tabGroup.selectedIndex == 0) {
                this.filteredModules = this.modules;
            } else {
                this.filteredTools = this.tools;
            }
        }
        // libraries filter
        if (this.selectedLibraries.length > 0) {
            this.filteredModules = this.filteredModules.filter((m) =>
                this.selectedLibraries.some((lib) => m.libraries.includes(lib))
            );
            this.filteredTools = this.filteredTools.filter((m) =>
                this.selectedLibraries.some((lib) => m.libraries.includes(lib))
            );
        }
        // tasks filter
        if (this.selectedTasks.length > 0) {
            this.filteredModules = this.filteredModules.filter((m) =>
                this.selectedTasks.some((task) => m.tasks.includes(task))
            );
            this.filteredTools = this.filteredTools.filter((m) =>
                this.selectedTasks.some((task) => m.tasks.includes(task))
            );
        }
        // categories filter
        if (this.selectedCategories.length > 0) {
            this.filteredModules = this.filteredModules.filter((m) =>
                this.selectedCategories.some((cat) =>
                    m.categories.includes(cat)
                )
            );
            this.filteredTools = this.filteredTools.filter((m) =>
                this.selectedCategories.some((cat) =>
                    m.categories.includes(cat)
                )
            );
        }
        // datatypes filter
        if (this.selectedDatatypes.length > 0) {
            this.filteredModules = this.filteredModules.filter((m) =>
                this.selectedDatatypes.some(
                    (dt) => m['data-type']?.includes(dt)
                )
            );
            this.filteredTools = this.filteredTools.filter((m) =>
                this.selectedDatatypes.some(
                    (dt) => m['data-type']?.includes(dt)
                )
            );
        }
        // tags filter
        if (this.selectedTags.length > 0) {
            this.filteredModules = this.filteredModules.filter((m) =>
                this.selectedTags.some((tag) => m.tags.includes(tag))
            );
            this.filteredTools = this.filteredTools.filter((m) =>
                this.selectedTags.some((tag) => m.tags.includes(tag))
            );
        }

        this.resultsFound = this.getNumResults();
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

    resetFilters() {
        this.selectedLibraries = [];
        this.selectedTasks = [];
        this.selectedCategories = [];
        this.selectedDatatypes = [];
    }
}
