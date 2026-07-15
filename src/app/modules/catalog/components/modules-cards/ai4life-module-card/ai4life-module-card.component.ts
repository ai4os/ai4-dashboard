import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Ai4lifeModule } from '@app/shared/interfaces/module.interface';
import {
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardSubtitle,
} from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDivider } from '@angular/material/list';
import { MarkdownComponent } from 'ngx-markdown';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-ai4life-module-card',
    templateUrl: './ai4life-module-card.component.html',
    styleUrl: './ai4life-module-card.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatCard,
        RouterLink,
        MatCardHeader,
        MatCardTitle,
        MatIcon,
        MatTooltip,
        MatCardContent,
        MatDivider,
        MatCardSubtitle,
        MarkdownComponent,
        TranslatePipe,
    ],
})
export class Ai4lifeModuleCardComponent {
    constructor() {}

    @Input() module!: Ai4lifeModule;
}
