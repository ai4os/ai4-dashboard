import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MarkdownComponent } from 'ngx-markdown';
import { TranslatePipe } from '@ngx-translate/core';
import { UiCardComponent } from '@app/shared/components/ui/ui-card/ui-card.component';
import { UiChipComponent } from '@app/shared/components/ui/ui-chip/ui-chip.component';
import { Ai4lifeModule } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-ai4life-module-card',
    templateUrl: './ai4life-module-card.component.html',
    styleUrl: './ai4life-module-card.component.scss',
    imports: [
        UiCardComponent,
        UiChipComponent,
        MatIcon,
        MarkdownComponent,
        TranslatePipe,
    ],
})
export class Ai4lifeModuleCardComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    @Input({ required: true }) module!: Ai4lifeModule;

    openModule(): void {
        this.router.navigate(['ai4life', this.module.name], {
            relativeTo: this.route,
        });
    }
}
