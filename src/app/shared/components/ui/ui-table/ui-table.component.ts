import { Component, ContentChildren, Input, QueryList } from '@angular/core';
import { UiTableCellDirective } from '@app/shared/directives/ui-table-cell.directive';

export interface UiTableColumn<T> {
    key: keyof T | string;
    label: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
}

@Component({
    selector: 'app-ui-table',
    templateUrl: './ui-table.component.html',
    styleUrl: './ui-table.component.scss',
})
export class UiTableComponent<T extends Record<string, any>> {
    @Input({ required: true }) columns: UiTableColumn<T>[] = [];
    @Input({ required: true }) data: T[] = [];
    @Input() trackByKey: keyof T = 'id' as keyof T;
    @Input() emptyMessage = 'GENERAL.NO-DATA';

    @ContentChildren(UiTableCellDirective)
    cellTemplates!: QueryList<UiTableCellDirective>;
    private templateMap = new Map<string, UiTableCellDirective>();

    ngAfterContentInit(): void {
        this.cellTemplates.forEach((t) => this.templateMap.set(t.columnKey, t));
    }

    getTemplate(key: string) {
        return this.templateMap.get(key) ?? null;
    }

    trackByFn = (_: number, row: T) => row[this.trackByKey] ?? row;
}
