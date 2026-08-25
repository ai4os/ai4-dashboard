import {
    Component,
    EventEmitter,
    Input,
    Output,
    inject,
    signal,
    ChangeDetectionStrategy,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import {
    ScrollingModule,
    CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';

export interface AutocompleteOption {
    value: string | number | boolean;
    viewValue: string;
}

let nextId = 0;

@Component({
    selector: 'app-ui-autocomplete',
    templateUrl: './ui-autocomplete.component.html',
    styleUrls: ['./ui-autocomplete.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIcon, TranslatePipe, OverlayModule, ScrollingModule],
})
export class UiAutocompleteComponent implements ControlValueAccessor {
    ngControl = inject(NgControl, { optional: true, self: true });

    @Input() label?: string;
    @Input() placeholder?: string;
    @Input() hint?: string;
    @Input() options: AutocompleteOption[] | null = [];
    @Input() errorMessages: Record<string, string> = {};

    @Output() optionSelected = new EventEmitter<AutocompleteOption>();

    protected internalValue = signal<any>('');
    protected displayValue = signal<string>('');
    protected disabled = signal(false);
    protected isOpen = signal(false);
    protected activeIndex = signal(-1);

    @ViewChild(CdkVirtualScrollViewport) viewport?: CdkVirtualScrollViewport;

    private readonly instanceId = nextId++;
    protected readonly labelId = `ui-autocomplete-label-${this.instanceId}`;
    protected readonly panelId = `ui-autocomplete-panel-${this.instanceId}`;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private onChange: (value: any) => void = () => {};

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private onTouched: () => void = () => {};

    constructor() {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    writeValue(value: any): void {
        this.internalValue.set(value ?? '');
        this.displayValue.set(value ?? '');
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

    protected onInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.internalValue.set(input.value);
        this.displayValue.set(input.value);
        this.onChange(input.value);
        this.open();
    }

    protected open(): void {
        if (this.disabled()) return;
        this.isOpen.set(true);
        this.activeIndex.set(-1);

        setTimeout(() => {
            this.viewport?.checkViewportSize();
        });
    }

    protected close(): void {
        if (!this.isOpen()) return;
        this.isOpen.set(false);
    }

    protected toggle(event: Event): void {
        event.stopPropagation();
        if (this.disabled()) return;
        if (this.isOpen()) {
            this.close();
        } else {
            this.open();
        }
    }

    protected onBlur(): void {
        this.onTouched();
        setTimeout(() => this.close(), 150);
    }

    protected selectOption(option: AutocompleteOption, event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        if (this.disabled()) return;

        this.internalValue.set(option.viewValue);
        this.displayValue.set(option.viewValue);
        this.onChange(option.viewValue);
        this.optionSelected.emit(option);
        this.close();
    }

    protected onKeydown(event: KeyboardEvent): void {
        if (this.disabled()) return;
        const opts = this.options || [];

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                if (!this.isOpen()) this.open();
                else {
                    const nextIndex = Math.min(
                        this.activeIndex() + 1,
                        opts.length - 1
                    );
                    this.activeIndex.set(nextIndex);
                    this.viewport?.scrollToIndex(nextIndex);
                }
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (!this.isOpen()) this.open();
                else {
                    const prevIndex = Math.max(this.activeIndex() - 1, 0);
                    this.activeIndex.set(prevIndex);
                    this.viewport?.scrollToIndex(prevIndex);
                }
                break;
            case 'Enter':
                event.preventDefault();
                if (
                    this.isOpen() &&
                    this.activeIndex() >= 0 &&
                    opts.length > 0
                ) {
                    this.selectOption(opts[this.activeIndex()], event);
                }
                break;
            case 'Escape':
                if (this.isOpen()) {
                    event.preventDefault();
                    this.close();
                }
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

    protected onOverlayAttach(): void {
        setTimeout(() => {
            this.viewport?.checkViewportSize();
        });
    }
}
