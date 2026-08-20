import {
    Component,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

export interface Tab {
    id: string;
    label: string;
    icon?: string;
    disabled?: boolean;
    tooltip?: string;
}

@Component({
    selector: 'app-ui-tabs',
    templateUrl: './ui-tabs.component.html',
    styleUrl: './ui-tabs.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatTooltip, MatIcon, TranslatePipe],
})
export class UiTabsComponent {
    @Input() tabs: Tab[] = [];
    @Input() activeTabId?: string;
    @Output() tabChange = new EventEmitter<string>();

    indicatorLeft: number = 0;
    indicatorWidth: number = 0;

    selectTab(id: string, element?: EventTarget | null) {
        this.activeTabId = id;
        this.tabChange.emit(id);

        if (element instanceof HTMLElement) {
            this.indicatorLeft = element.offsetLeft + 12;
            this.indicatorWidth = element.offsetWidth - 24;
        }
    }
}
