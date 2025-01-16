import { Component, Input } from '@angular/core';
import { Ai4lifeModuleSummary } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-ai4life-module-card',
    templateUrl: './ai4life-module-card.component.html',
    styleUrl: './ai4life-module-card.component.scss',
})
export class Ai4lifeModuleCardComponent {
    @Input() module!: Ai4lifeModuleSummary;
}
