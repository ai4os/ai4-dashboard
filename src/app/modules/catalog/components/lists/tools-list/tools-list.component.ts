import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import { ModuleSummary } from '@app/shared/interfaces/module.interface';
import { IntroJSService } from 'introjs/introjs.service';

@Component({
    selector: 'app-tools-list',
    templateUrl: './tools-list.component.html',
    styleUrl: './tools-list.component.scss',
})
export class ToolsListComponent implements AfterViewInit {
    constructor(
        private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef,
        private toolsService: ToolsService,
        private introService: IntroJSService,
        public dialog: MatDialog
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
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
            if (!this.toolsLoading) {
                clearInterval(interval);
                this.introService.nvFlareTool();
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
