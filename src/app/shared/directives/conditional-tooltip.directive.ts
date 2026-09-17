import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
    selector: '[appConditionalTooltip]',
    hostDirectives: [MatTooltip],
})
export class ConditionalTooltipDirective {
    @Input('appConditionalTooltip') set tooltipText(
        value: string | null | undefined
    ) {
        this.matTooltip.message = value || '';
    }

    @Input('matTooltipClass') set tooltipClass(value: string) {
        this.matTooltip.tooltipClass = value;
    }

    constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly matTooltip: MatTooltip
    ) {}

    @HostListener('mouseenter')
    onMouseEnter(): void {
        const element = this.elementRef.nativeElement;

        const isOverflowing = element.scrollWidth > element.clientWidth;

        if (isOverflowing) {
            this.matTooltip.disabled = false;
            this.matTooltip.show();
        } else {
            this.matTooltip.disabled = true;
        }
    }
}
