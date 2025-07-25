import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { ModulesService } from '../../../services/modules-service/modules.service';
import {
    Ai4lifeModule,
    ModuleSummary,
} from '@app/shared/interfaces/module.interface';
import { filter } from 'rxjs';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { NavigationEnd, Router } from '@angular/router';
import { IntroJSService } from 'introjs/introjs.service';

@Component({
    selector: 'app-modules-list',
    templateUrl: './modules-list.component.html',
    styleUrls: ['./modules-list.component.scss'],
})
export class ModulesListComponent implements OnInit, AfterViewInit {
    constructor(
        private router: Router,
        private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef,
        private modulesService: ModulesService,
        private snackbarService: SnackbarService,
        private introService: IntroJSService,
        public dialog: MatDialog
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);

        // scroll to last scrollY position
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                const scrollTop = sessionStorage.getItem('scrollTop');
                if (scrollTop) {
                    setTimeout(() => {
                        const content = document.querySelector(
                            '.sidenav-content'
                        ) as HTMLElement;
                        if (content) {
                            content.scrollTop = +scrollTop;
                        }
                    }, 100);
                }
            });
    }

    @ViewChild('tabGroup', { static: false }) tabGroup!: MatTabGroup;

    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    searchFormGroup!: FormGroup;

    selectedTabIndex = 0;
    marketplaceName = 'ai4eosc';

    ai4eoscModules: ModuleSummary[] = [];
    ai4lifeModules: Ai4lifeModule[] = [];

    ai4eoscModulesLoading = false;
    ai4lifeModulesLoading = false;

    ngOnInit(): void {
        this.ai4eoscModulesLoading = true;
        this.ai4lifeModulesLoading = true;

        const marketplace = sessionStorage.getItem('selectedMarketplace');
        if (marketplace) {
            try {
                this.marketplaceName = JSON.parse(marketplace);
            } catch (e) {
                this.snackbarService.openError(
                    'Marketplace could not be loaded. Please try again later.'
                );
            }
        }

        this.getAi4eoscModules();
        this.getAi4lifeModules();

        if (this.marketplaceName === 'ai4eosc') {
            this.selectTab(0);
        } else {
            this.selectTab(2);
        }
    }

    ngAfterViewInit(): void {
        const interval = setInterval(() => {
            if (!this.ai4eoscModulesLoading) {
                clearInterval(interval);
                // this.introService.batchDeployments();
            }
        }, 200);
    }

    getAi4eoscModules() {
        this.modulesService.getModulesSummary().subscribe({
            next: (modules) => {
                this.ai4eoscModules = modules;
                this.ai4eoscModulesLoading = false;
            },
            error: () => {
                setTimeout(() => (this.ai4eoscModulesLoading = false), 3000);
            },
        });
    }

    getAi4lifeModules() {
        this.modulesService.getAi4lifeModules().subscribe({
            next: (modules: Ai4lifeModule[]) => {
                this.ai4lifeModules = modules;
                this.ai4lifeModulesLoading = false;
            },
            error: () => {
                setTimeout(() => (this.ai4lifeModulesLoading = false), 3000);
            },
        });
    }

    selectMarketplace(tabChangeEvent: MatTabChangeEvent): void {
        this.marketplaceName = tabChangeEvent.tab.textLabel.toLowerCase();
        sessionStorage.setItem(
            'selectedMarketplace',
            JSON.stringify(this.marketplaceName)
        );
    }

    selectTab(index: number): void {
        this.selectedTabIndex = index;
    }
}
