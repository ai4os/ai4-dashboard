import { Component, inject, Input } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { VoInfo } from '@app/shared/interfaces/profile.interface';

@Component({
    selector: 'app-overview-tab',
    templateUrl: './overview-tab.component.html',
    styleUrl: './overview-tab.component.scss',
})
export class OverviewTabComponent {
    appConfigService = inject(AppConfigService);

    @Input() vos: VoInfo[] = [];
}
