import {
    Directive,
    ElementRef,
    Input,
    HostListener,
    inject,
} from '@angular/core';
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

    @Input() set tooltipClass(value: string) {
        this.matTooltip.tooltipClass = value;
    }

    elementRef = inject(ElementRef<HTMLElement>);
    matTooltip = inject(MatTooltip);

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
