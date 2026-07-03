import {
    Component,
    inject,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { VoInfo } from '@app/shared/interfaces/profile.interface';

@Component({
    selector: 'app-overview-tab',
    templateUrl: './overview-tab.component.html',
    styleUrl: './overview-tab.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class OverviewTabComponent {
    appConfigService = inject(AppConfigService);

    @Input() vos: VoInfo[] = [];
}
