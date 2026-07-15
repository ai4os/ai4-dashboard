import {
    Component,
    inject,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { VoInfo } from '@app/shared/interfaces/profile.interface';
import { UiListCardComponent } from '../../../../../shared/components/ui/ui-list-card/ui-list-card.component';
import { UiChipComponent } from '../../../../../shared/components/ui/ui-chip/ui-chip.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-overview-tab',
    templateUrl: './overview-tab.component.html',
    styleUrl: './overview-tab.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [UiListCardComponent, UiChipComponent, TranslatePipe],
})
export class OverviewTabComponent {
    appConfigService = inject(AppConfigService);

    @Input() vos: VoInfo[] = [];
}
