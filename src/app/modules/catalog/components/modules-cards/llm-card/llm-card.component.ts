import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { VllmModelConfig } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-llm-card',
    templateUrl: './llm-card.component.html',
    styleUrl: './llm-card.component.scss',
})
export class LlmCardComponent {
    constructor(private router: Router) {}

    @Input() llm!: VllmModelConfig;

    loadLLM() {
        this.router.navigate(['catalog/tools/ai4os-llm/deploy'], {
            state: { llmId: this.llm.family + '/' + this.llm.name },
        });
    }
}
