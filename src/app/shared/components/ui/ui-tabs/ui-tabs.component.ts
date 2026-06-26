import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface UiTab {
    id: string;
    label: string;
    icon?: string;
}

@Component({
    selector: 'app-ui-tabs',
    templateUrl: './ui-tabs.component.html',
    styleUrl: './ui-tabs.component.scss',
})
export class UiTabsComponent {
    @Input() tabs: UiTab[] = [];
    @Input() activeTabId?: string;
    @Output() tabChange = new EventEmitter<string>();

    selectTab(id: string): void {
        if (this.activeTabId !== id) {
            this.activeTabId = id;
            this.tabChange.emit(id);
        }
    }
}
