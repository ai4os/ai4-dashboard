import {
    Component,
    Input,
    inject,
    ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { TitleCasePipe } from '@angular/common';
import { UiChipComponent } from '../ui-chip/ui-chip.component';

@Component({
    selector: 'app-ui-chip-group',
    templateUrl: './ui-chip-group.component.html',
    styleUrls: ['./ui-chip-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TranslatePipe, TitleCasePipe, UiChipComponent],
})
export class UiChipGroupComponent implements ControlValueAccessor {
    @Input() label = '';
    @Input() options: { value: any; viewValue: string }[] = [];
    @Input() hint = '';

    ngControl = inject(NgControl, { optional: true, self: true });

    internalValue: any = null;
    isDisabled = false;

    constructor() {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onChange = (val: any) => {};

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onTouched = () => {};

    writeValue(value: any): void {
        this.internalValue = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    selectOption(value: any): void {
        if (this.isDisabled) return;
        this.internalValue = value;
        this.onChange(value);
        this.onTouched();
    }

    get isInvalid(): boolean {
        const c = this.ngControl?.control;
        return !!(c?.invalid && (c?.dirty || c?.touched));
    }
}
