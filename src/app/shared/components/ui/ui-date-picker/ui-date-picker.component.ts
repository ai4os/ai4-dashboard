import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatInput } from '@angular/material/input';
import {
    MatDatepickerInput,
    MatDatepicker,
} from '@angular/material/datepicker';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-ui-date-picker',
    templateUrl: './ui-date-picker.component.html',
    styleUrls: ['./ui-date-picker.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatIcon,
        MatTooltip,
        MatInput,
        MatDatepickerInput,
        MatDatepicker,
        TranslatePipe,
    ],
})
export class UiDatePickerComponent {
    @Input() value: Date | null = null;
    @Input() placeholder = 'Select a date';
    @Input() min: Date | null = null;
    @Input() max: Date | null = null;
    @Input() disabled = false;
    @Input() clearable = false;
    @Input() tooltip? = '';
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
