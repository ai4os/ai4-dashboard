import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-ui-date-picker',
    templateUrl: './ui-date-picker.component.html',
    styleUrls: ['./ui-date-picker.component.scss'],
})
export class UiDatePickerComponent {
    @Input() value: Date | null = null;
    @Input() placeholder = 'Select a date';
    @Input() min: Date | null = null;
    @Input() max: Date | null = null;
    @Input() disabled = false;
    @Input() clearable = false;
    @Output() valueChange = new EventEmitter<Date | null>();

    onDateChange(date: Date | null): void {
        this.value = date;
        this.valueChange.emit(date);
    }

    clear(event: MouseEvent): void {
        event.stopPropagation();
        this.value = null;
        this.valueChange.emit(null);
    }
}
