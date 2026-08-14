import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { UiCardComponent } from '@app/shared/components/ui/ui-card/ui-card.component';
import { UiChipComponent } from '@app/shared/components/ui/ui-chip/ui-chip.component';
import { ModuleSummary } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-ai4eosc-module-card',
    templateUrl: './ai4eosc-module-card.component.html',
    styleUrl: './ai4eosc-module-card.component.scss',
    imports: [UiCardComponent, UiChipComponent, MatIcon, TranslatePipe],
})
export class Ai4eoscModuleCardComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    @Input({ required: true }) module!: ModuleSummary;

    get isTool(): boolean {
        return this.module.categories?.includes('AI4 tools') ?? false;
    }

    get typeIcon(): string {
        const dataTypes = this.module['data-type'];
        const defaultIcon = this.isTool ? 'handyman' : 'model_training';

        if (!dataTypes || dataTypes.length !== 1) {
            return defaultIcon;
        }

        const type = dataTypes[0].toLowerCase();

        if (type === 'other') {
            return defaultIcon;
        }

        if (type === 'video') {
            return 'videocam';
        }
        if (type === 'image') {
            return 'image';
        }
        if (type === 'audio') {
            return 'audiotrack';
        }
        if (type === 'text') {
            return 'description';
        }
        if (type === 'tabular') {
            return 'table_view';
        }
        if (type === 'time series') {
            return 'timeline';
        }

        return defaultIcon;
    }

    openModule(): void {
        this.router.navigate([this.module.name], { relativeTo: this.route });
    }
}
