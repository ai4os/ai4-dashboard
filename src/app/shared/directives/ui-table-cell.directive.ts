import { Directive, inject, Input, TemplateRef } from '@angular/core';

@Directive({
    selector: '[uiTableCell]',
    standalone: false,
})
export class UiTableCellDirective {
    @Input('uiTableCell') columnKey!: string;

    template = inject(TemplateRef<any>);
}
