import { TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ModuleSummary } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-module-card',
    templateUrl: './module-card.component.html',
    styleUrls: ['./module-card.component.scss'],
    providers: [TitleCasePipe],
})
export class ModuleCardComponent implements OnInit {
    constructor(public titleCasePipe: TitleCasePipe) {}

    // This property is bound using its original name.
    @Input() module!: ModuleSummary;
    @Input() isTool?: boolean;

    displayedKeywords: string[] = [];

    ngOnInit(): void {
        if (this.module) {
            const displayedKeywordsArray = this.module.categories
                .filter(
                    (category) =>
                        category.includes('AI4 inference') ||
                        category.includes('AI4 trainable') ||
                        category.includes('AI4 pre trained') ||
                        category.includes('AI4 tools')
                )
                .map((keyword) => this.titleCasePipe.transform(keyword));
            this.displayedKeywords = displayedKeywordsArray;
        }
    }
}
