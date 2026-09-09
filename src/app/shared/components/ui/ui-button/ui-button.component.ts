import {
    Component,
    Input,
    ChangeDetectionStrategy,
    OnInit,
    EventEmitter,
    Output,
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-ui-button',
    templateUrl: './ui-button.component.html',
    styleUrl: './ui-button.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatTooltip, MatIcon, TranslatePipe],
})
export class UiButtonComponent implements OnInit {
    @Input() variant:
        | 'primary-solid'
        | 'primary-outline'
        | 'accent-solid'
        | 'accent-outline'
        | 'default-solid'
        | 'default-outline'
        | 'danger-solid'
        | 'danger-outline'
        | 'icon' = 'primary-solid';

    @Input() icon?: string;
    @Input() iconPosition?: string = 'left';
    @Input() image?: string;
    @Input() text?: string;
    @Input() disabled = false;
    @Input() tooltip?: string;
    @Input() href?: string;
    @Output() buttonClick = new EventEmitter<MouseEvent>();

    ngOnInit(): void {
        if (!this.icon && !this.text) {
            throw new Error(
                'UiButtonComponent: you should include either "icon" or "text".'
            );
        }
    }

    onClick(event: MouseEvent): void {
        this.buttonClick.emit(event);
    }

    onLinkClick(event: MouseEvent): void {
        event.stopPropagation();
    }
}
