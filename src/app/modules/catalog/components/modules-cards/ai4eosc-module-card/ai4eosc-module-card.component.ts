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

    private readonly TYPE_ICON_MAP: Record<string, string> = {
        video: 'videocam',
        image: 'image',
        audio: 'audiotrack',
        text: 'description',
        tabular: 'table_view',
        'time series': 'timeline',
    };

    @Input({ required: true }) module!: ModuleSummary;

    get isTool(): boolean {
        return this.module.categories?.includes('AI4 tools') ?? false;
    }

    get typeIcon(): string {
        const defaultIcon = 'model_training';

        if (this.isTool) {
            const id = this.module.id;
            if (id === 'ai4os-llm') {
                return 'network_intel_node';
            }

            return `assets/images/tools/${id}-icon.png`;
        }

        const dataTypes = this.module['data-type'];
        if (!dataTypes || dataTypes.length !== 1) {
            return defaultIcon;
        }

        const type = dataTypes[0].toLowerCase();

        return this.TYPE_ICON_MAP[type] || defaultIcon;
    }

    openModule(): void {
        this.router.navigate([this.module.name], { relativeTo: this.route });
    }
}
