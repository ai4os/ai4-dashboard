import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SearchLlmsPipe } from '@app/modules/catalog/pipes/search-card-pipe';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import { VllmModelConfig } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-llms-list',
    templateUrl: './llms-list.component.html',
    styleUrl: './llms-list.component.scss',
})
export class LlmsListComponent {
    constructor(
        private toolsService: ToolsService,
        private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef,
        public dialog: MatDialog,
        private fb: FormBuilder
    ) {
        this.filterPipe = new SearchLlmsPipe();

        this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }
    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;

    searchFormGroup!: FormGroup;
    filterPipe: SearchLlmsPipe;
    resultsFound = 0;

    llmsLoading = false;
    llms: VllmModelConfig[] = [];

    ngOnInit(): void {
        this.initializeForm();
        this.getLLMs();
    }

    initializeForm() {
        this.searchFormGroup = this.fb.group({
            search: '',
        });
    }

    updateResultsFound() {
        this.resultsFound = this.filterPipe.transform(
            this.llms,
            this.searchFormGroup.controls['search'].value
        ).length;
    }

    getLLMs() {
        this.llmsLoading = true;
        this.toolsService.getVllmModelConfiguration().subscribe({
            next: (llms) => {
                this.llms = llms;
                this.resultsFound = this.llms.length;
                this.llmsLoading = false;
            },
            error: () => {
                setTimeout(() => (this.llmsLoading = false), 3000);
            },
        });
    }
}
