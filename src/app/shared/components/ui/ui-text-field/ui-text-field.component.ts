import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Optional,
    Output,
    Self,
    signal,
    SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
    selector: 'app-ui-text-field',
    templateUrl: './ui-text-field.component.html',
    styleUrl: './ui-text-field.component.scss',
})
export class UiTextFieldComponent implements ControlValueAccessor, OnChanges {
    @Input() label?: string;
    @Input() placeholder?: string;
    @Input() hint?: string;
    @Input() type: 'text' | 'password' | 'email' | 'url' = 'text';
    @Input() maskable = false;
    @Input() prefixIcon?: string;
    @Input() errorMessages: Record<string, string> = {};

    // Standalone mode (without formControlName).
    // When using formControlName, value comes from writeValue().
    @Input() value?: string;
    @Output() valueChange = new EventEmitter<string>();

    protected internalValue = signal('');
    protected disabled = signal(false);
    protected hidden = signal(true);

    private onChange: (value: string) => void = () => {};
    private onTouched: () => void = () => {};

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Standalone mode: propagate [value] input changes to internalValue signal
        // Only if the component is not used with formControlName (ngControl is null)
        if (changes['value'] && !this.ngControl) {
            this.internalValue.set(this.value ?? '');
        }
    }

    writeValue(value: string): void {
        this.internalValue.set(value ?? '');
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }

    protected onInput(event: Event): void {
        const val = (event.target as HTMLInputElement).value;
        this.internalValue.set(val);
        this.onChange(val);
        this.valueChange.emit(val);
    }

    protected onBlur(): void {
        this.onTouched();
    }

    protected toggleVisibility(): void {
        this.hidden.set(!this.hidden());
    }

    get isInvalid(): boolean {
        const c = this.ngControl?.control;
        return !!(c?.invalid && c?.touched);
    }

    get currentError(): string | null {
        const errors = this.ngControl?.control?.errors;
        if (!errors || !this.ngControl?.control?.touched) return null;
        const firstKey = Object.keys(errors)[0];
        return this.errorMessages[firstKey] ?? null;
    }

    get inputType(): string {
        if (this.maskable) return this.hidden() ? 'password' : 'text';
        return this.type;
    }
}
