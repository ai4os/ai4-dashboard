import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModulesService } from '@app/modules/marketplace/services/modules-service/modules.service';
import { Module } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-dev-module-card',
    templateUrl: './dev-module-card.component.html',
    styleUrls: ['./dev-module-card.component.scss'],
    providers: [TitleCasePipe],
})
export class DevModuleCardComponent implements OnInit {
    constructor(
        public titleCasePipe: TitleCasePipe,
        private modulesService: ModulesService,
        public dialog: MatDialog
    ) {}

    devModuleName = 'ai4os-dev-env';

    // This property is bound using its original name.
    module: Module | undefined;

    moduleType: 'Development' | 'Model' = 'Model';
    displayedKeywords: string[] = [];

    ngOnInit(): void {
        this.modulesService
            .getModule(this.devModuleName)
            .subscribe((module) => {
                if (module) {
                    this.module = module;
                    const displayedKeywordsArray = module.categories
                        .filter(
                            (keyword) =>
                                keyword.includes('inference') ||
                                keyword.includes('trainable') ||
                                keyword.includes('pre-trained')
                        )
                        .map((keyword) =>
                            this.titleCasePipe.transform(keyword)
                        );
                    this.displayedKeywords = displayedKeywordsArray;
                }
            });
    }
}
