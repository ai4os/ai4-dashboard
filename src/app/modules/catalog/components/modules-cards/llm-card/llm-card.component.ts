import {
    Component,
    Input,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { VllmModelConfig } from '@app/shared/interfaces/module.interface';
import { MatTooltip } from '@angular/material/tooltip';
import {
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardSubtitle,
    MatCardFooter,
} from '@angular/material/card';
import { MatDivider } from '@angular/material/list';
import { MarkdownComponent } from 'ngx-markdown';
import { MatChipSet } from '@angular/material/chips';
import { ChipWithIconComponent } from '../../../../../shared/components/chip-with-icon/chip-with-icon.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-llm-card',
    templateUrl: './llm-card.component.html',
    styleUrl: './llm-card.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatTooltip,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatDivider,
        MatCardSubtitle,
        MarkdownComponent,
        MatCardFooter,
        MatChipSet,
        ChipWithIconComponent,
        TranslatePipe,
    ],
})
export class LlmCardComponent implements OnInit {
    protected authService = inject(AuthService);
    private router = inject(Router);

    @Input() llm!: VllmModelConfig;

    isAuthorized = false;
    image = '';

    ngOnInit(): void {
        this.image = this.llm.family;

        this.authService.userProfile$.subscribe((profile) => {
            if (profile) {
                this.isAuthorized =
                    this.authService.isAuthenticated() && profile.isAuthorized;
            }
        });
    }

    loadLLM() {
        this.router.navigate(['catalog/llms/ai4os-llm/deploy'], {
            state: { llmId: this.llm.family + '/' + this.llm.name },
        });
    }

    openLink(e: MouseEvent) {
        e.stopPropagation();
        const url =
            'https://huggingface.co/' + this.llm.family + '/' + this.llm.name;
        window.open(url);
    }
}
