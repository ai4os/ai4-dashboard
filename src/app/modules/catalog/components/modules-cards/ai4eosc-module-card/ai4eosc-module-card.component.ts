import { TitleCasePipe } from '@angular/common';
import {
    Component,
    Input,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { ModuleSummary } from '@app/shared/interfaces/module.interface';

@Component({
    selector: 'app-ai4eosc-module-card',
    templateUrl: './ai4eosc-module-card.component.html',
    styleUrls: ['./ai4eosc-module-card.component.scss'],
    providers: [TitleCasePipe],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
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
