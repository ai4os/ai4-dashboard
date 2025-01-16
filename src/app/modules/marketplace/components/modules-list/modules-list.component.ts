import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { ModulesService } from '../../services/modules-service/modules.service';
import {
    Ai4lifeModuleSummary,
    ModuleSummary,
} from '@app/shared/interfaces/module.interface';
import { forkJoin } from 'rxjs';
import { ToolsService } from '../../services/tools-service/tools.service';

@Component({
    selector: 'app-modules-list',
    templateUrl: './modules-list.component.html',
    styleUrls: ['./modules-list.component.scss'],
})
export class ModulesListComponent implements OnInit {
    constructor(
        private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef,
        private modulesService: ModulesService,
        private toolsService: ToolsService,
        public dialog: MatDialog
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    searchFormGroup!: FormGroup;

    marketplaceName = 'ai4eosc';

    ai4eoscModules: ModuleSummary[] = [];
    ai4lifeModules: Ai4lifeModuleSummary[] = [];

    ai4eoscModulesLoading = false;
    ai4lifeModulesLoading = false;

    ngOnInit(): void {
        this.ai4eoscModulesLoading = true;
        this.ai4lifeModulesLoading = true;

        this.getAi4eoscModules();
        this.getAi4lifeModules();
    }

    getAi4eoscModules() {
        forkJoin({
            modules: this.modulesService.getModulesSummary(),
            tools: this.toolsService.getToolsSummary(),
        }).subscribe({
            next: (result) => {
                this.ai4eoscModules = this.ai4eoscModules
                    .concat(result.tools)
                    .concat(result.modules);
                this.ai4eoscModulesLoading = false;
            },
            error: () => {
                setTimeout(() => (this.ai4eoscModulesLoading = false), 3000);
            },
        });
    }

    getAi4lifeModules() {
        this.modulesService.getAi4lifeModules().subscribe({
            next: (modules: Ai4lifeModuleSummary[]) => {
                this.ai4lifeModules = modules;
                this.ai4lifeModulesLoading = false;
            },
            error: () => {
                setTimeout(() => (this.ai4lifeModulesLoading = false), 3000);
            },
        });
    }

    selectMarketplace(name: string) {
        this.marketplaceName = name;
    }
}
