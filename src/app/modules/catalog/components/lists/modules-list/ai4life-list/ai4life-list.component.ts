import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TranslatePipe } from '@ngx-translate/core';

import { ModulesStore } from '@app/modules/catalog/store/modules.store';
import { UiTextFieldComponent } from '@app/shared/components/ui/ui-text-field/ui-text-field.component';
import { UiLoaderComponent } from '@app/shared/components/ui/ui-loader/ui-loader.component';
import { Ai4lifeModuleCardComponent } from '../../../modules-cards/ai4life-module-card/ai4life-module-card.component';

const MOBILE_BREAKPOINT = '(max-width: 600px)';
const SEARCH_DEBOUNCE_MS = 250;
const PAGE_SIZE = 16;

@Component({
    selector: 'app-ai4life-list',
    templateUrl: './ai4life-list.component.html',
    styleUrl: './ai4life-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatToolbar,
        MatIcon,
        MatPaginator,
        ReactiveFormsModule,
        UiTextFieldComponent,
        UiLoaderComponent,
        Ai4lifeModuleCardComponent,
        TranslatePipe,
    ],
})
export class Ai4lifeListComponent {
    readonly store = inject(ModulesStore);
    private readonly fb = inject(FormBuilder);
    private readonly breakpointObserver = inject(BreakpointObserver);

    readonly isMobile = toSignal(
        this.breakpointObserver
            .observe(MOBILE_BREAKPOINT)
            .pipe(map((state) => state.matches)),
        { initialValue: this.breakpointObserver.isMatched(MOBILE_BREAKPOINT) }
    );

    readonly filtersForm = this.fb.nonNullable.group({
        search: '',
    });

    private readonly searchTerm = toSignal(
        this.filtersForm.controls.search.valueChanges.pipe(
            startWith(this.filtersForm.controls.search.value),
            debounceTime(SEARCH_DEBOUNCE_MS)
        ),
        { initialValue: this.filtersForm.controls.search.value }
    );

    readonly pageIndex = signal(0);
    readonly pageSize = PAGE_SIZE;

    readonly modulesLoading = this.store.loading;
    readonly modulesError = this.store.error;
    readonly modules = computed(() => this.store.ai4lifeModules());

    readonly filteredModules = computed(() => {
        const search = this.searchTerm().trim().toLowerCase();
        if (!search) return this.modules();

        return this.modules().filter(
            (m) =>
                m.name?.toLowerCase().includes(search) ||
                m.description?.toLowerCase().includes(search) ||
                m.tags?.some((tag) => tag.toLowerCase().includes(search))
        );
    });

    readonly resultsFound = computed(() => this.filteredModules().length);

    readonly pagedModules = computed(() => {
        const start = this.pageIndex() * this.pageSize;
        return this.filteredModules().slice(start, start + this.pageSize);
    });

    constructor() {
        effect(
            () => {
                this.filteredModules();
                this.pageIndex.set(0);
            },
            { allowSignalWrites: true }
        );
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex.set(event.pageIndex);
    }
}
