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
import { TranslatePipe } from '@ngx-translate/core';
import { MatTooltip } from '@angular/material/tooltip';
import { OverlayModule } from '@angular/cdk/overlay';
import { SelectOption } from '../ui-select/ui-select.component';

let nextId = 0;

@Component({
    selector: 'app-ui-select-multiple',
    templateUrl: './ui-select-multiple.component.html',
    styleUrl: './ui-select-multiple.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIcon, TranslatePipe, MatTooltip, OverlayModule],
})
export class UiSelectMultipleComponent implements ControlValueAccessor {
    ngControl = inject(NgControl, { optional: true, self: true });
    private elementRef = inject(ElementRef);

    @Input() label?: string;
    @Input() placeholder?: string;
    @Input() hint?: string;
    @Input() options: SelectOption[] = [];
    @Input() errorMessages: Record<string, string> = {};
    @Input() prefixIcon?: string;
    @Input() showLabel? = true;
    @Input() searchable = false;

    @Output() valueChange = new EventEmitter<any[]>();

    protected internalValue = signal<any[]>([]);
    protected disabled = signal(false);
    protected isOpen = signal(false);
    protected activeIndex = signal(-1);
    protected searchQuery = signal('');

    private readonly instanceId = nextId++;
    protected readonly labelId = `ui-select-multi-label-${this.instanceId}`;
    protected readonly panelId = `ui-select-multi-panel-${this.instanceId}`;

    protected filteredOptions = computed(() => {
        const query = this.searchQuery().toLowerCase();
        if (!query) return this.options;
        return this.options.filter((o) =>
            o.viewValue.toLowerCase().includes(query)
        );
    });

    protected displayValue = computed(() => {
        const selected = this.internalValue() || [];
        if (selected.length === 0) return null;

        const firstOption = this.options.find((o) => o.value === selected[0]);
        const firstText = firstOption ? firstOption.viewValue : selected[0];

        if (selected.length === 1) return { main: firstText, extra: null };

        const extraCount = selected.length - 1;
        const extraText = selected.length === 2 ? 'other' : 'others';

        return { main: firstText, extra: `(+${extraCount} ${extraText})` };
    });

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private onChange: (value: any[]) => void = () => {};

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

    registerOnChange(fn: (value: any[]) => void): void {
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

        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    }

    protected open(): void {
        if (this.disabled()) return;
        this.searchQuery.set('');
        this.activeIndex.set(0);
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

    protected isSelected(value: any): boolean {
        return this.internalValue().includes(value);
    }

    protected toggleOption(option: SelectOption, event?: Event): void {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (this.disabled()) return;

        const current = [...this.internalValue()];
        const index = current.indexOf(option.value);

        if (index >= 0) {
            current.splice(index, 1);
        } else {
            current.push(option.value);
        }

        this.internalValue.set(current);
        this.onChange(current);
        this.valueChange.emit(current);
    }

    protected updateSearch(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.searchQuery.set(input.value);
        this.activeIndex.set(0);
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
                    if (option) this.toggleOption(option, event);
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
