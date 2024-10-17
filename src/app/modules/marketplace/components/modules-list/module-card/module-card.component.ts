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

    @Input() module!: ModuleSummary;

    isTool = false;
    displayedKeywords: string[] = [];

    ngOnInit(): void {
        if (this.module) {
            this.isTool = this.module.categories.includes('AI4 tools');
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
