import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-ui-text-field',
    templateUrl: './ui-text-field.component.html',
    styleUrls: ['./ui-text-field.component.scss'],
})
export class UiTextFieldComponent {
    @Input() placeholder = '';
    @Input() value = '';
    @Input() disabled = false;
    @Output() valueChange = new EventEmitter<string>();

    onInput(e: Event) {
        this.value = (e.target as HTMLInputElement).value;
        this.valueChange.emit(this.value);
    }
}
