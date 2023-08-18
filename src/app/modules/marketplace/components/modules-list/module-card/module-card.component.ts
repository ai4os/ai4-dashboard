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

    moduleType: 'Development' | 'Model' = 'Model';
    displayedKeywords: string[] = [];

    ngOnInit(): void {
        if (this.module) {
            this.moduleType = this.module.keywords.includes('development')
                ? 'Development'
                : 'Model';
            const displayedKeywordsArray = this.module.keywords
                .filter(
                    (keyword) =>
                        keyword.includes('inference') ||
                        keyword.includes('trainable') ||
                        keyword.includes('pre-trained')
                )
                .map((keyword) => this.titleCasePipe.transform(keyword));
            this.displayedKeywords = displayedKeywordsArray;
        }
    }
}
