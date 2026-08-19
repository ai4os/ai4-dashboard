import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    signal,
    SimpleChanges,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-ui-toggle',
    templateUrl: './ui-toggle.component.html',
    styleUrl: './ui-toggle.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TranslatePipe],
})
export class UiToggleComponent implements ControlValueAccessor, OnChanges {
    ngControl = inject(NgControl, { optional: true, self: true });

    @Input() label?: string;
    @Input() hint?: string;

    // Standalone mode (without formControlName).
    // When using formControlName, value comes from writeValue().
    @Input() checked = false;
    @Output() checkedChange = new EventEmitter<boolean>();

    protected internalValue = signal(false);
    protected disabled = signal(false);

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private onChange: (value: boolean) => void = () => {};

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private onTouched: () => void = () => {};

    constructor() {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Standalone mode: propagate [checked] input changes to internalValue signal.
        // Only if the component is not used with formControlName (ngControl is null)
        if (changes['checked'] && !this.ngControl) {
            this.internalValue.set(this.checked);
        }
    }

    writeValue(value: boolean): void {
        this.internalValue.set(!!value);
    }

    registerOnChange(fn: (value: boolean) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }

    protected toggle(): void {
        if (this.disabled()) return;
        const next = !this.internalValue();
        this.internalValue.set(next);
        this.onChange(next);
        this.onTouched();
        this.checkedChange.emit(next);
    }
}
