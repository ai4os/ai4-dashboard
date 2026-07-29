import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    computed,
    inject,
    signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { debounceTime, map, startWith } from 'rxjs';

import { ToolsService } from '@app/modules/catalog/services/tools-service/tools.service';
import { VllmModelConfig } from '@app/shared/interfaces/module.interface';
import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';
import { UiTextFieldComponent } from '@app/shared/components/ui/ui-text-field/ui-text-field.component';
import {
    UiSelectComponent,
    SelectOption,
} from '@app/shared/components/ui/ui-select/ui-select.component';
import { LlmCardComponent } from '../../modules-cards/llm-card/llm-card.component';
import { UiLoaderComponent } from '@app/shared/components/ui/ui-loader/ui-loader.component';

const ALL_FAMILIES = 'ALL' as const;
const MOBILE_BREAKPOINT = '(max-width: 600px)';
const SEARCH_DEBOUNCE_MS = 250;

@Component({
    selector: 'app-llms-list',
    templateUrl: './llms-list.component.html',
    styleUrl: './llms-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatToolbar,
        MatIcon,
        ReactiveFormsModule,
        UiTextFieldComponent,
        UiSelectComponent,
        LlmCardComponent,
        TranslatePipe,
        UiBannerComponent,
        UiLoaderComponent,
    ],
})
export class LlmsListComponent implements OnInit {
    private readonly toolsService = inject(ToolsService);
    private readonly fb = inject(FormBuilder);
    private readonly breakpointObserver = inject(BreakpointObserver);
    private readonly translate = inject(TranslateService);

    readonly dialog = inject(MatDialog);
    readonly allFamiliesOption = ALL_FAMILIES;

    readonly filtersForm = this.fb.nonNullable.group({
        search: '',
        family: ALL_FAMILIES as string,
    });

    readonly isMobile = toSignal(
        this.breakpointObserver
            .observe(MOBILE_BREAKPOINT)
            .pipe(map((state) => state.matches)),
        { initialValue: this.breakpointObserver.isMatched(MOBILE_BREAKPOINT) }
    );

    private readonly searchTerm = toSignal(
        this.filtersForm.controls.search.valueChanges.pipe(
            startWith(this.filtersForm.controls.search.value),
            debounceTime(SEARCH_DEBOUNCE_MS)
        ),
        { initialValue: this.filtersForm.controls.search.value }
    );

    private readonly selectedFamily = toSignal(
        this.filtersForm.controls.family.valueChanges.pipe(
            startWith(this.filtersForm.controls.family.value)
        ),
        { initialValue: this.filtersForm.controls.family.value }
    );

    private readonly allFamiliesLabel = toSignal(
        this.translate.onLangChange.pipe(
            startWith(null),
            map(() => this.translate.instant('CATALOG.LLMS.ALL'))
        ),
        { initialValue: this.translate.instant('CATALOG.LLMS.ALL') }
    );

    readonly llms = signal<VllmModelConfig[]>([]);
    readonly llmsLoading = signal(false);
    readonly llmsError = signal(false);

    readonly families = computed(() => {
        const uniqueFamilies = new Set(this.llms().map((llm) => llm.family));
        return [...uniqueFamilies].sort((a, b) => a.localeCompare(b));
    });

    readonly familyOptions = computed<SelectOption[]>(() => [
        { value: ALL_FAMILIES, viewValue: this.allFamiliesLabel() },
        ...this.families().map((family) => ({
            value: family,
            viewValue: family,
        })),
    ]);

    readonly filteredLlms = computed(() => {
        const search = this.searchTerm().trim().toLowerCase();
        const family = this.selectedFamily();

        return this.llms().filter((llm) => {
            const matchesFamily =
                family === ALL_FAMILIES || llm.family === family;

            const matchesSearch =
                !search ||
                llm.name.toLowerCase().includes(search) ||
                llm.description.toLowerCase().includes(search);

            return matchesFamily && matchesSearch;
        });
    });

    readonly resultsFound = computed(() => this.filteredLlms().length);

    ngOnInit(): void {
        this.loadLlms();
    }

    private loadLlms(): void {
        this.llmsLoading.set(true);
        this.llmsError.set(false);

        this.toolsService.getVllmModelConfiguration().subscribe({
            next: (llms) => {
                this.llms.set(llms);
                this.llmsLoading.set(false);
            },
            error: () => {
                this.llmsLoading.set(false);
                this.llmsError.set(true);
            },
        });
    }
}
