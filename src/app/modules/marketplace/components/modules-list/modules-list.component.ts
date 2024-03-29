import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModuleSummary } from '@app/shared/interfaces/module.interface';
import { ModulesService } from '../../services/modules-service/modules.service';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { Observable, forkJoin } from 'rxjs';
import { AuthService } from '@app/core/services/auth/auth.service';
import { ToolsService } from '../../services/tools-service/tools.service';
import { TagObject } from '@app/data/types/tags';
import { MediaMatcher } from '@angular/cdk/layout';

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

    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    searchFormGroup!: FormGroup;
    isLoading = false;

    modules: ModuleSummary[] = [];
    tools: ModuleSummary[] = [];

    moduleType: 'development' | 'model' = 'model';

    initializeForm() {
        this.searchFormGroup = this.fb.group({
            search: '',
        });
    }

    /**
     * Function that retrieves a list of modules
     * If tags are defined in the config file of the project it makes a request for every tag object
     *
     * @memberof ModulesListComponent
     */
    getModulesSummaryFromService() {
        this.isLoading = true;

        if (this.appConfigService.tags) {
            const tags = this.appConfigService.tags;
            const observableList: Observable<ModuleSummary[]>[] = [];
            tags.forEach((tag: TagObject) => {
                observableList.push(this.modulesService.getModulesSummary(tag));
            });

            const observableResult = forkJoin(observableList);
            observableResult.subscribe({
                next: (modules) => {
                    this.isLoading = false;
                    const jointModulesArray = ([] as ModuleSummary[]).concat(
                        ...modules
                    );
                    // Delete possible duplicates from array based on name
                    this.modules = jointModulesArray.filter(
                        (v, i, a) =>
                            a.findIndex((v2) => v2.name === v.name) === i
                    );
                },
                error: () => {
                    setTimeout(() => (this.isLoading = false), 3000);
                },
            });
        } else {
            this.modulesService.getModulesSummary().subscribe({
                next: (modules) => {
                    this.isLoading = false;
                    this.modules = modules;
                },
                error: () => {
                    setTimeout(() => (this.isLoading = false), 3000);
                },
            });
        }
    }

    getToolsSummary() {
        this.isLoading = true;
        this.toolsService
            .getToolsSummary()
            .subscribe((tools: ModuleSummary[]) => {
                this.tools = tools;
            });
    }

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }

    ngOnInit(): void {
        this.initializeForm();
        this.getModulesSummaryFromService();
        this.getToolsSummary();
    }
}
