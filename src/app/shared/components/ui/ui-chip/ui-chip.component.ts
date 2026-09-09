import {
    Component,
    Input,
    ChangeDetectionStrategy,
    OnInit,
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';

export type ChipVariant =
    | 'primary-solid'
    | 'primary-outline'
    | 'accent-solid'
    | 'accent-outline'
    | 'success-solid'
    | 'success-outline'
    | 'warning-solid'
    | 'warning-outline'
    | 'secondary-1-solid'
    | 'secondary-1-outline'
    | 'secondary-2-solid'
    | 'secondary-2-outline'
    | 'secondary-3-solid'
    | 'secondary-3-outline'
    | 'secondary-4-solid'
    | 'secondary-4-outline'
    | 'secondary-5-solid'
    | 'secondary-5-outline'
    | 'danger-solid'
    | 'danger-outline'
    | 'default-solid'
    | 'default-outline';

@Component({
    selector: 'app-ui-chip',
    templateUrl: './ui-chip.component.html',
    styleUrl: './ui-chip.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatTooltip, MatIcon],
})
export class UiChipComponent implements OnInit {
    @Input() variant: ChipVariant = 'primary-solid';
    @Input() icon?: string;
    @Input() text?: string;
    @Input() html?: string;
    @Input() tooltip?: string;
    @Input() disabled = false;

    ngOnInit(): void {
        if (!this.icon && !this.text && !this.html) {
            throw new Error(
                'UiChipComponent: you should include either "icon", "text", or "html".'
            );
        }
    }
}
