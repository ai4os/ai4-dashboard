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
import { MatTooltip } from '@angular/material/tooltip';
import { MarkdownComponent } from 'ngx-markdown';
import { UiCardComponent } from '@app/shared/components/ui/ui-card/ui-card.component';
import { UiChipComponent } from '@app/shared/components/ui/ui-chip/ui-chip.component';
import { TranslatePipe } from '@ngx-translate/core';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';
import {
    SelfLllmSummary,
    PlatformLlmSummary,
} from '@app/shared/interfaces/llms.interface';

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

    @Input({ required: true }) type!: string;
    @Input({ required: true }) llm!: SelfLllmSummary | PlatformLlmSummary;

    isAuthorized = false;

    get logoSrc(): string {
        const familyName = this.llm.family.toLowerCase();
        // TODO: review images when metadata is ready
        return `../../../assets/images/llm-families/${familyName}.svg`;
    }

    get isHealthy(): boolean {
        return 'status' in this.llm ? this.llm.status === 'healthy' : true;
    }

    get isDisabled(): boolean {
        return !this.isAuthorized || !this.isHealthy;
    }

    get tooltipText(): string {
        if (!this.isAuthorized) {
            return 'CATALOG.COMMON.UNAUTHORIZED';
        }
        if (!this.isHealthy) {
            return 'CATALOG.LLMS.MODEL-UNAVAILABLE';
        }
        return '';
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
        if (this.isDisabled) {
            return;
        }

        // platform-wide
        if (this.type === 'platform-wide') {
            const url = `https://genai.cloud.ai4eosc.eu/chat?model=${encodeURIComponent(this.llm.id)}`;
            window.open(url);
        } else {
            // self-deployed
            this.router.navigate(['catalog/llms/ai4os-llm/deploy'], {
                state: { llmId: `${this.llm.id}` },
            });
        }
    }
}
