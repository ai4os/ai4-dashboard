import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import { ModuleSummary } from '@app/shared/interfaces/module.interface';
import { IntroJSService } from 'introjs/introjs.service';
import { filter } from 'rxjs';

@Component({
    selector: 'app-tools-list',
    templateUrl: './tools-list.component.html',
    styleUrl: './tools-list.component.scss',
})
export class ToolsListComponent {
    constructor(
        private router: Router,
        private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef,
        private toolsService: ToolsService,
        private introService: IntroJSService,
        private appConfigService: AppConfigService,
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
    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;
    searchFormGroup!: FormGroup;

    tools: ModuleSummary[] = [];
    toolsLoading = false;

    ngOnInit(): void {
        this.toolsLoading = true;
        this.getTools();
    }

    ngAfterViewInit(): void {
        const interval = setInterval(() => {
            if (
                !this.toolsLoading &&
                this.appConfigService.voName !== 'vo.imagine-ai.eu'
            ) {
                clearInterval(interval);
                this.introService.llmTool();
            }
        }, 200);
    }

    getTools() {
        this.toolsService.getToolsSummary().subscribe({
            next: (tools) => {
                this.tools = tools;
                this.toolsLoading = false;
            },
            error: () => {
                setTimeout(() => (this.toolsLoading = false), 3000);
            },
        });
    }
}
