import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { ProjectLink } from '../sidenav/sidenav.component';
import { gitInfo } from '@environments/version';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class FooterComponent implements OnInit {
    private appConfigService = inject(AppConfigService);

    protected gitInfo = gitInfo;
    year = new Date().getFullYear();
    links: ProjectLink[] = [];
    footerLinks: ProjectLink[] = [];

    ngOnInit(): void {
        this.links = this.appConfigService.footerLinks;
        this.footerLinks = this.appConfigService.footerLinks;
    }
}
