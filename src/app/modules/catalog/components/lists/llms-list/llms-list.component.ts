import { MediaMatcher } from '@angular/cdk/layout';
import {
    ChangeDetectorRef,
    Component,
    ChangeDetectionStrategy,
    OnInit,
    inject,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SearchLlmsPipe } from '@app/modules/catalog/pipes/search-card-pipe';
import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import { VllmModelConfig } from '@app/shared/interfaces/module.interface';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
    MatFormField,
    MatPrefix,
    MatLabel,
    MatInput,
} from '@angular/material/input';
import { LlmCardComponent } from '../../modules-cards/llm-card/llm-card.component';
import { TranslatePipe } from '@ngx-translate/core';
import { SearchLlmsPipe as SearchLlmsPipe_1 } from '../../../pipes/search-card-pipe';

@Component({
    selector: 'app-llms-list',
    templateUrl: './llms-list.component.html',
    styleUrl: './llms-list.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatToolbar,
        MatIcon,
        MatProgressSpinner,
        FormsModule,
        ReactiveFormsModule,
        MatFormField,
        MatPrefix,
        MatLabel,
        MatInput,
        LlmCardComponent,
        TranslatePipe,
        SearchLlmsPipe_1,
    ],
})
export class LlmsListComponent implements OnInit {
    private toolsService = inject(ToolsService);
    private media = inject(MediaMatcher);
    private changeDetectorRef = inject(ChangeDetectorRef);
    dialog = inject(MatDialog);
    private fb = inject(FormBuilder);

    constructor() {
        this.filterPipe = new SearchLlmsPipe();

        this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () =>
            this.changeDetectorRef.detectChanges();
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
