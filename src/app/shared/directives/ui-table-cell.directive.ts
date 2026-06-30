import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({ selector: '[uiTableCell]' })
export class UiTableCellDirective {
    @Input('uiTableCell') columnKey!: string;
    constructor(public template: TemplateRef<any>) {}
}
