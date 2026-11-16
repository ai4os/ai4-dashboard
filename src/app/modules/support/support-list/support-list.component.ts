import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';
import { PlatformServiceCardComponent } from '@app/modules/platform-services/platform-service-card/platform-service-card.component';

export interface PlatformService {
    id: string;
    name: string;
    url: string;
    desc?: string;
}

@Component({
    selector: 'app-platform-services-list',
    imports: [TranslatePipe, PlatformServiceCardComponent, UiBannerComponent],
    templateUrl: './support-list.component.html',
    styleUrl: './support-list.component.scss',
})
export class SupportListComponent {
    services: PlatformService[] = [
        {
            id: 'docs',
            name: 'SIDENAV.DOCUMENTATION',
            url: 'https://docs.ai4eosc.eu/en/latest/',
            desc: 'Explore the platform documentation to learn how to use its services, access available resources, and get step-by-step guidance, tutorials, and technical information.',
        },
        {
            id: 'help',
            name: 'SIDENAV.HELPDESK',
            url: 'https://helpdesk.cloud.ai4eosc.eu/#login',
            desc: 'Need assistance? Contact our support team to report issues, ask questions, and get help with the platform and its services.',
        },
        {
            id: 'groups',
            name: 'SIDENAV.COMMNUNITY-FORUM',
            url: 'https://community.cloud.ai4eosc.eu/',
            desc: 'Connect with AI/ML researchers and practitioners to ask questions, exchange knowledge, share experiences, discuss ideas, and publish AI-related stories and articles.',
        },
    ];
}
