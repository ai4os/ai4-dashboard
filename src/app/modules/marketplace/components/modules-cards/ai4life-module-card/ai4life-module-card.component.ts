import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ai4lifeModuleSummary } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-ai4life-module-card',
    templateUrl: './ai4life-module-card.component.html',
    styleUrl: './ai4life-module-card.component.scss',
})
export class Ai4lifeModuleCardComponent {
    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {}

    @Input() module!: Ai4lifeModuleSummary;

    loadTool() {
        this.router.navigate(['tools/ai4os-ai4life-loader/deploy'], {
            relativeTo: this.route,
            state: { modelId: this.module.id },
        });
    }
}
