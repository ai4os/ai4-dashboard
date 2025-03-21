import { Component, Input } from '@angular/core';
import { Ai4lifeModule } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-ai4life-module-card',
    templateUrl: './ai4life-module-card.component.html',
    styleUrl: './ai4life-module-card.component.scss',
})
export class Ai4lifeModuleCardComponent {
    constructor() {}

    @Input() module!: Ai4lifeModule;
}
