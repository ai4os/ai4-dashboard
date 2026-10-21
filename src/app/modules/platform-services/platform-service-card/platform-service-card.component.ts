import { Component, Input } from '@angular/core';
import { PlatformService } from '../platform-services-list/platform-services-list.component';
import { UiCardComponent } from '@app/shared/components/ui/ui-card/ui-card.component';
import { MarkdownComponent } from 'ngx-markdown';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-platform-service-card',
    imports: [UiCardComponent, MarkdownComponent, TranslatePipe, MatIcon],
    templateUrl: './platform-service-card.component.html',
    styleUrl: './platform-service-card.component.scss',
})
export class PlatformServiceCardComponent {
    @Input({ required: true }) service!: PlatformService;
    @Input() colorIndex: number = 0;

    get accentColorVar(): string {
        const colors = [
            'var(--color-secondary-1)',
            'var(--color-secondary-2)',
            'var(--color-secondary-3)',
            'var(--color-secondary-5)',
        ];
        return colors[this.colorIndex % colors.length];
    }

    visitLink() {
        window.open(this.service.url);
    }
}
