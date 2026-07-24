import { MediaMatcher } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SearchAi4lifePipe } from '@app/modules/catalog/pipes/search-card-pipe';
import { Ai4lifeModule } from '@app/shared/interfaces/module.interface';
import { MatToolbar } from '@angular/material/toolbar';
import {
    MatFormField,
    MatPrefix,
    MatLabel,
    MatInput,
} from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { Ai4lifeModuleCardComponent } from '../../../modules-cards/ai4life-module-card/ai4life-module-card.component';
import { TranslatePipe } from '@ngx-translate/core';
import { SearchAi4lifePipe as SearchAi4lifePipe_1 } from '../../../../pipes/search-card-pipe';

@Component({
    selector: 'app-ai4life-list',
    templateUrl: './ai4life-list.component.html',
    styleUrl: './ai4life-list.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatToolbar,
        FormsModule,
        ReactiveFormsModule,
        MatFormField,
        MatIcon,
        MatPrefix,
        MatLabel,
        MatInput,
        Ai4lifeModuleCardComponent,
        TranslatePipe,
        SearchAi4lifePipe_1,
    ],
})
export class Ai4lifeListComponent implements OnInit {
    media = inject(MediaMatcher);
    changeDetectorRef = inject(ChangeDetectorRef);
    dialog = inject(MatDialog);
    fb = inject(FormBuilder);

    constructor() {
        this.filterPipe = new SearchAi4lifePipe();

        this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () =>
            this.changeDetectorRef.detectChanges();
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
