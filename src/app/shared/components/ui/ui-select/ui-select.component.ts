import {
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Optional,
    Output,
    Self,
    computed,
    inject,
    signal,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

export interface SelectOption {
    value: string | number | boolean;
    viewValue: string;
}

let nextId = 0;

@Component({
    selector: 'app-ui-select',
    templateUrl: './ui-select.component.html',
    styleUrl: './ui-select.component.scss',
})
export class UiSelectComponent implements ControlValueAccessor {
    @Input() label?: string;
    @Input() placeholder?: string;
    @Input() hint?: string;
    @Input() options: SelectOption[] = [];
    @Input() errorMessages: Record<string, string> = {};

    @Output() valueChange = new EventEmitter<any>();

    protected internalValue = signal<any>('');
    protected disabled = signal(false);
    protected isOpen = signal(false);
    protected activeIndex = signal(-1);

    protected selectedOption = computed(
        () => this.options.find((o) => o.value === this.internalValue()) ?? null
    );

    private readonly instanceId = nextId++;
    protected readonly labelId = `ui-select-label-${this.instanceId}`;
    protected readonly panelId = `ui-select-panel-${this.instanceId}`;

    private onChange: (value: any) => void = () => {};
    private onTouched: () => void = () => {};

    private elementRef = inject(ElementRef);

    constructor(@Optional() @Self() public ngControl: NgControl) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    writeValue(value: any): void {
        this.internalValue.set(value ?? '');
    }

    registerOnChange(fn: (value: any) => void): void {
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
        this.isOpen() ? this.close() : this.open();
    }

    protected open(): void {
        if (this.disabled()) return;
        const currentIndex = this.options.findIndex(
            (o) => o.value === this.internalValue()
        );
        this.activeIndex.set(currentIndex >= 0 ? currentIndex : 0);
        this.isOpen.set(true);
    }

    protected close(): void {
        if (!this.isOpen()) return;
        this.isOpen.set(false);
        this.onTouched();
    }

    @HostListener('document:click', ['$event'])
    protected onDocumentClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.close();
        }
    }

    protected selectOption(option: SelectOption, event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        if (this.disabled()) return;
        this.internalValue.set(option.value);
        this.onChange(option.value);
        this.valueChange.emit(option.value);
        this.close();
    }

    protected onTriggerKeydown(event: KeyboardEvent): void {
        if (this.disabled()) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (!this.isOpen()) {
                    this.open();
                } else {
                    this.activeIndex.set(
                        Math.min(
                            this.activeIndex() + 1,
                            this.options.length - 1
                        )
                    );
                }
                break;

            case 'ArrowUp':
                event.preventDefault();
                if (!this.isOpen()) {
                    this.open();
                } else {
                    this.activeIndex.set(Math.max(this.activeIndex() - 1, 0));
                }
                break;

            case 'Enter':
            case ' ':
                event.preventDefault();
                if (!this.isOpen()) {
                    this.open();
                } else if (this.activeIndex() >= 0) {
                    const option = this.options[this.activeIndex()];
                    if (option) this.selectOption(option, event);
                }
                break;

            case 'Escape':
                if (this.isOpen()) {
                    event.preventDefault();
                    this.close();
                }
                break;

            case 'Tab':
                this.close();
                break;
        }
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
}
