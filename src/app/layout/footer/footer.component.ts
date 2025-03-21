import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { ProjectLink } from '../sidenav/sidenav.component';
import { gitInfo } from '@environments/version';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
    constructor(private appConfigService: AppConfigService) {}

    protected gitInfo = gitInfo;
    year = new Date().getFullYear();
    links: ProjectLink[] = [];
    footerLinks: ProjectLink[] = [];

    ngOnInit(): void {
        this.links = this.appConfigService.footerLinks;
        this.footerLinks = this.appConfigService.footerLinks;
    }
}
