import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
    computed,
    inject,
    signal,
    ChangeDetectionStrategy,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { SelectOption } from '../ui-select/ui-select.component';
import { UiChipComponent } from '../ui-chip/ui-chip.component';

let nextId = 0;

@Component({
    selector: 'app-ui-chip-input',
    templateUrl: './ui-chip-input.component.html',
    styleUrl: './ui-chip-input.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIcon, TranslatePipe, OverlayModule, UiChipComponent],
})
export class UiChipInputComponent implements ControlValueAccessor {
    ngControl = inject(NgControl, { optional: true, self: true });
    private readonly elementRef = inject(ElementRef);
    private readonly translate = inject(TranslateService);

    @Input() label?: string;
    @Input() placeholder?: string;
    @Input() hint?: string;
    @Input() options: SelectOption[] = [];
    @Input() errorMessages: Record<string, string> = {};
    @Input() prefixIcon?: string;
    @Input() showLabel = true;
    @Input() allowCustomValues = true;
    @Input() removeTooltip = 'GENERAL.REMOVE';

    @Output() valueChange = new EventEmitter<string[]>();

    protected internalValue = signal<string[]>([]);
    protected disabled = signal(false);
    protected isOpen = signal(false);
    protected inputValue = signal('');
    protected activeIndex = signal(-1);

    private readonly instanceId = nextId++;
    protected readonly labelId = `ui-chip-input-label-${this.instanceId}`;
    protected readonly panelId = `ui-chip-input-panel-${this.instanceId}`;

    protected filteredOptions = computed(() => {
        const query = this.inputValue().toLowerCase();
        const notSelected = this.options.filter(
            (o) => !this.internalValue().includes(String(o.value))
        );
        if (!query) return notSelected;
        return notSelected.filter((o) =>
            o.viewValue.toLowerCase().includes(query)
        );
    });

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private onChange: (value: string[]) => void = () => {};
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private onTouched: () => void = () => {};

    constructor() {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    writeValue(value: any): void {
        this.internalValue.set(Array.isArray(value) ? value : []);
    }

    registerOnChange(fn: (value: string[]) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled.set(isDisabled);
    }

    protected onInputFocus(): void {
        if (this.disabled()) return;
        this.isOpen.set(true);
        this.activeIndex.set(0);
    }

    protected onInputChange(event: Event): void {
        const val = (event.target as HTMLInputElement).value;
        this.inputValue.set(val);
        this.isOpen.set(true);
        this.activeIndex.set(0);
    }

    protected onInputKeydown(event: KeyboardEvent): void {
        if (this.disabled()) return;

        switch (event.key) {
            case 'Enter':
            case ',':
                event.preventDefault();
                if (this.isOpen() && this.activeIndex() >= 0) {
                    const option = this.filteredOptions()[this.activeIndex()];
                    if (option) {
                        this.selectSuggestion(option);
                        return;
                    }
                }
                this.commitInputValue();
                break;

            case 'Backspace':
                if (!this.inputValue() && this.internalValue().length) {
                    this.removeChip(
                        this.internalValue()[this.internalValue().length - 1]
                    );
                }
                break;

            case 'ArrowDown':
                event.preventDefault();
                this.activeIndex.set(
                    Math.min(
                        this.activeIndex() + 1,
                        this.filteredOptions().length - 1
                    )
                );
                break;

            case 'ArrowUp':
                event.preventDefault();
                this.activeIndex.set(Math.max(this.activeIndex() - 1, 0));
                break;

            case 'Escape':
                this.isOpen.set(false);
                break;
        }
    }

    private commitInputValue(): void {
        const val = this.inputValue().trim();
        if (!val) return;

        if (!this.allowCustomValues) {
            const exists = this.options.some((o) => o.viewValue === val);
            if (!exists) {
                this.inputValue.set('');
                return;
            }
        }

        this.addChip(val);
        this.inputValue.set('');
    }

    protected selectSuggestion(option: SelectOption): void {
        this.addChip(String(option.value));
        this.inputValue.set('');
    }

    private addChip(val: string): void {
        if (this.internalValue().includes(val)) return;
        const updated = [...this.internalValue(), val];
        this.internalValue.set(updated);
        this.onChange(updated);
        this.valueChange.emit(updated);
    }

    protected removeChip(val: string, event?: Event): void {
        event?.stopPropagation();
        const updated = this.internalValue().filter((v) => v !== val);
        this.internalValue.set(updated);
        this.onChange(updated);
        this.valueChange.emit(updated);
    }

    protected onBlur(): void {
        this.commitInputValue();
        this.onTouched();
    }

    @HostListener('document:click', ['$event'])
    protected onDocumentClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen.set(false);
        }
    }

    protected chipTooltip(): string {
        return this.translate.instant(this.removeTooltip);
    }

    get isInvalid(): boolean {
        const c = this.ngControl?.control;
        return !!(c?.invalid && c?.touched);
    }

    get currentError(): string | null {
        const errors = this.ngControl?.control?.errors;
        if (!errors || !this.ngControl?.control?.touched) return null;
        return this.errorMessages[Object.keys(errors)[0]] ?? null;
    }
}
