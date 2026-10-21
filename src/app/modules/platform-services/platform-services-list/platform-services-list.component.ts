import { Component, inject } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { TranslatePipe } from '@ngx-translate/core';
import { PlatformServiceCardComponent } from '../platform-service-card/platform-service-card.component';
import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';

export interface PlatformService {
    id: string;
    name: string;
    url: string;
    desc?: string;
}

@Component({
    selector: 'app-platform-services-list',
    imports: [TranslatePipe, PlatformServiceCardComponent, UiBannerComponent],
    templateUrl: './platform-services-list.component.html',
    styleUrl: './platform-services-list.component.scss',
})
export class PlatformServicesListComponent {
    private readonly appConfigService = inject(AppConfigService);

    services: PlatformService[] = this.appConfigService.sidenavMenu ?? [];
}
