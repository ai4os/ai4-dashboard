import {
    Component,
    Input,
    OnInit,
    ChangeDetectionStrategy,
    DestroyRef,
    inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { VllmModelConfig } from '@app/shared/interfaces/module.interface';
import { MatTooltip } from '@angular/material/tooltip';
import { MarkdownComponent } from 'ngx-markdown';
import { UiCardComponent } from '@app/shared/components/ui/ui-card/ui-card.component';
import { UiChipComponent } from '@app/shared/components/ui/ui-chip/ui-chip.component';
import { TranslatePipe } from '@ngx-translate/core';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';

@Component({
    selector: 'app-llm-card',
    templateUrl: './llm-card.component.html',
    styleUrl: './llm-card.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatTooltip,
        MarkdownComponent,
        UiCardComponent,
        UiChipComponent,
        TranslatePipe,
        UiButtonComponent,
    ],
})
export class LlmCardComponent implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);

    @Input({ required: true }) llm!: VllmModelConfig;

    isAuthorized = false;

    get logoSrc(): string {
        const familyName = this.llm.family.toLowerCase();
        return `../../../assets/images/llm-families/${familyName}.svg`;
    }

    ngOnInit(): void {
        this.authService.userProfile$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((profile) => {
                if (profile) {
                    this.isAuthorized =
                        this.authService.isAuthenticated() &&
                        profile.isAuthorized;
                }
            });
    }

    loadLLM(): void {
        this.router.navigate(['catalog/llms/ai4os-llm/deploy'], {
            state: { llmId: `${this.llm.family}/${this.llm.name}` },
        });
    }
}
