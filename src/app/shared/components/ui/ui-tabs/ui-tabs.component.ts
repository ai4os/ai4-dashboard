import { Component, Input, Output, EventEmitter } from '@angular/core';

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
})
export class UiTabsComponent {
    @Input() tabs: Tab[] = [];
    @Input() activeTabId?: string;
    @Output() tabChange = new EventEmitter<string>();

    selectTab(id: string): void {
        if (this.activeTabId !== id) {
            this.activeTabId = id;
            this.tabChange.emit(id);
        }
    }
}
