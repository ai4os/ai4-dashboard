import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import { ModuleSummary } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-tools-list',
    templateUrl: './tools-list.component.html',
    styleUrl: './tools-list.component.scss',
})
export class ToolsListComponent implements OnInit {
    constructor(
        private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef,
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

    tools: ModuleSummary[] = [];
    toolsLoading = false;

    ngOnInit(): void {
        this.toolsLoading = true;
        this.getTools();
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
