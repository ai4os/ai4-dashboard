import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SearchAi4lifePipe } from '@app/modules/marketplace/pipes/search-card-pipe';
import { Ai4lifeModule } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-ai4life-list',
    templateUrl: './ai4life-list.component.html',
    styleUrl: './ai4life-list.component.scss',
})
export class Ai4lifeListComponent implements OnInit {
    constructor(
        private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef,
        public dialog: MatDialog,
        private fb: FormBuilder
    ) {
        this.filterPipe = new SearchAi4lifePipe();

        this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }
    private _mobileQueryListener: () => void;
    mobileQuery: MediaQueryList;

    @Input() modules: Ai4lifeModule[] = [];

    searchFormGroup!: FormGroup;
    filterPipe: SearchAi4lifePipe;
    resultsFound = 0;

    ngOnInit(): void {
        this.initializeForm();
        this.resultsFound = this.modules.length;
    }

    initializeForm() {
        this.searchFormGroup = this.fb.group({
            search: '',
        });
    }

    updateResultsFound() {
        this.resultsFound = this.filterPipe.transform(
            this.modules,
            this.searchFormGroup.controls['search'].value
        ).length;
    }
}
