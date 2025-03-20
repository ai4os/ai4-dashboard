import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VllmModelConfig } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-llm-card',
    templateUrl: './llm-card.component.html',
    styleUrl: './llm-card.component.scss',
})
export class LlmCardComponent implements OnInit {
    constructor(private router: Router) {}

    @Input() llm!: VllmModelConfig;

    image = '';

    ngOnInit(): void {
        this.image = this.llm.family;
    }

    loadLLM() {
        this.router.navigate(['catalog/llms/ai4os-llm/deploy'], {
            state: { llmId: this.llm.family + '/' + this.llm.name },
        });
    }
}
