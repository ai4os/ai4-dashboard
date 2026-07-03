import {
    Component,
    EventEmitter,
    Input,
    Output,
    signal,
    ChangeDetectionStrategy,
} from '@angular/core';

@Component({
    selector: 'app-ui-expansion-panel',
    templateUrl: './ui-expansion-panel.component.html',
    styleUrl: './ui-expansion-panel.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class UiExpansionPanelComponent {
    @Input() set expanded(value: boolean | undefined) {
        if (value !== undefined) this._expanded.set(value);
    }
    @Input() disabled = false;
    @Input() isExpansible? = true;
    @Output() expandedChange = new EventEmitter<boolean>();

    protected _expanded = signal(false);
    readonly isExpanded = this._expanded.asReadonly();

    toggle(): void {
        if (this.disabled) return;
        const next = !this._expanded();
        this._expanded.set(next);
        this.expandedChange.emit(next);
    }
}
