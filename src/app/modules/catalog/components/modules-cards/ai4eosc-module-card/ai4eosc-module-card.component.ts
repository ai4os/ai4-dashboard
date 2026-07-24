import { TitleCasePipe, NgClass } from '@angular/common';
import {
    Component,
    Input,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { ModuleSummary } from '@app/shared/interfaces/module.interface';
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
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-ai4eosc-module-card',
    templateUrl: './ai4eosc-module-card.component.html',
    styleUrls: ['./ai4eosc-module-card.component.scss'],
    providers: [TitleCasePipe],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatCard,
        NgClass,
        RouterLink,
        MatCardHeader,
        MatCardTitle,
        MatIcon,
        MatTooltip,
        MatCardContent,
        MatDivider,
        MatCardSubtitle,
        TranslatePipe,
    ],
})
export class Ai4eoscModuleCardComponent implements OnInit {
    titleCasePipe = inject(TitleCasePipe);

    @Input() module!: ModuleSummary;

    isTool = false;

    ngOnInit(): void {
        if (this.module) {
            this.isTool = this.module.categories.includes('AI4 tools');
        }
    }
}
