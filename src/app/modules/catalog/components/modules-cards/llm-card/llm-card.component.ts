import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { VllmModelConfig } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-llm-card',
    templateUrl: './llm-card.component.html',
    styleUrl: './llm-card.component.scss',
})
export class LlmCardComponent implements OnInit {
    constructor(
        protected authService: AuthService,
        private router: Router
    ) {}

    @Input() llm!: VllmModelConfig;

    isAuthorized = false;
    image = '';

    ngOnInit(): void {
        this.image = this.llm.family;

        this.authService.userProfileSubject.subscribe((profile) => {
            this.isAuthorized =
                this.authService.isAuthenticated() && profile.isAuthorized;
        });
    }

    loadLLM() {
        this.router.navigate(['catalog/llms/ai4os-llm/deploy'], {
            state: { llmId: this.llm.family + '/' + this.llm.name },
        });
    }
}
