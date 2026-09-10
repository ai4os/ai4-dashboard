import {
    Component,
    ContentChildren,
    Input,
    Output,
    EventEmitter,
    QueryList,
    ChangeDetectionStrategy,
    AfterContentInit,
} from '@angular/core';
import { UiTableCellDirective } from '@app/shared/directives/ui-table-cell.directive';
import { NgTemplateOutlet } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { UiLoaderComponent } from '@app/shared/components/ui/ui-loader/ui-loader.component';

export type UiTableSortDirection = 'asc' | 'desc' | null;

export interface UiTableSortEvent<T> {
    key: keyof T | string;
    direction: UiTableSortDirection;
}

export interface UiTableColumn<T> {
    key: keyof T | string;
    label: string;
    width?: string;
    minWidth?: string;
    align?: 'left' | 'center' | 'right';
    sticky?: boolean;
    sortable?: boolean;
}

@Component({
    selector: 'app-ui-table',
    templateUrl: './ui-table.component.html',
    styleUrl: './ui-table.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgTemplateOutlet, TranslatePipe, UiLoaderComponent],
})
export class UiTableComponent<
    T extends Record<string, any>,
> implements AfterContentInit {
    @Input({ required: true }) columns: UiTableColumn<T>[] = [];
    @Input({ required: true }) data: T[] = [];
    @Input() trackByKey: keyof T = 'id' as keyof T;
    @Input() emptyMessage = 'GENERAL.NO-DATA';
    @Input() loading = false;

    @Output() sortChange = new EventEmitter<UiTableSortEvent<T>>();

    @ContentChildren(UiTableCellDirective)
    cellTemplates!: QueryList<UiTableCellDirective>;
    private templateMap = new Map<string, UiTableCellDirective>();

    sortKey: keyof T | string | null = null;
    sortDirection: UiTableSortDirection = null;

    ngAfterContentInit(): void {
        this.cellTemplates.forEach((t) => this.templateMap.set(t.columnKey, t));
    }

    getTemplate(key: string) {
        return this.templateMap.get(key) ?? null;
    }

    trackByFn = (_: number, row: T) => row[this.trackByKey] ?? row;

    get gridTemplateColumns(): string {
        return this.columns
            .map((col) => {
                if (col.width === 'auto') {
                    return 'max-content';
                }
                if (col.width) {
                    return col.width;
                }
                if (col.minWidth) {
                    return `minmax(${col.minWidth}, 1fr)`;
                }
                return '1fr';
            })
            .join(' ');
    }

    onHeaderClick(col: UiTableColumn<T>): void {
        if (!col.sortable) {
            return;
        }

        if (this.sortKey !== col.key) {
            this.sortKey = col.key;
            this.sortDirection = 'asc';
        } else if (this.sortDirection === 'asc') {
            this.sortDirection = 'desc';
        } else {
            this.sortKey = null;
            this.sortDirection = null;
        }

        this.sortChange.emit({ key: col.key, direction: this.sortDirection });
    }
}
