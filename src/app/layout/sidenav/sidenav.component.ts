import { MediaMatcher } from '@angular/cdk/layout';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';
import { environment } from 'src/environments/environment';
import { gitInfo } from 'src/environments/version';

export interface ProjectLink {
    name: string;
    url: string;
    isRestricted?: boolean;
    isDisabled?: boolean;
}

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, AfterViewInit {
    constructor(
        private _formBuilder: FormBuilder,
        protected authService: AuthService,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private sidenavService: SidenavService,
        private appConfigService: AppConfigService
    ) {
        this.mobileQuery = this.media.matchMedia('(max-width: 1366px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    @ViewChild('sidenav', { static: true }) public sidenav!: MatSidenav;

    public isAuthorized = false;
    protected environment = environment;
    protected gitInfo = gitInfo;
    protected userProfile?: UserProfile;

    options = this._formBuilder.group({
        bottom: 0,
        fixed: false,
        top: 0,
    });

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    dashboardLink: ProjectLink = {
        name: 'SIDENAV.STATS',
        url: '/statistics',
        isRestricted: true,
        isDisabled: !this.isAuthorized,
    };

    catalogLinks: ProjectLink[] = [
        {
            name: 'SIDENAV.MODULES',
            url: '/catalog/modules',
        },
        {
            name: 'SIDENAV.TOOLS',
            url: '/catalog/tools',
        },
        {
            name: 'SIDENAV.LLMS',
            url: '/catalog/llms',
        },
    ];

    runtimeLinks: ProjectLink[] = [
        {
            name: 'SIDENAV.TRY-ME',
            url: '/tasks/try-me',
            isRestricted: true,
            isDisabled: !this.isLoggedIn(),
        },
        {
            name: 'SIDENAV.DEPLOYMENTS',
            url: '/tasks/deployments',
            isRestricted: true,
            isDisabled: !this.isAuthorized,
        },
        {
            name: 'SIDENAV.INFERENCE',
            url: '/tasks/inference',
            isRestricted: true,
            isDisabled: !this.isAuthorized,
        },
    ];

    otherLinks: ProjectLink[] = [];

    acknowledgments = '';
    projectName = '';
    projectUrl = '';
    voName = '';
    isDeployedInNomad = '';

    ngOnInit(): void {
        // save config and check vo
        this.otherLinks = this.appConfigService.sidenavMenu;
        this.acknowledgments = this.appConfigService.acknowledgments;
        this.projectName = this.appConfigService.projectName;
        this.projectUrl = this.appConfigService.projectUrl;
        this.voName = this.appConfigService.voName;
        this.isDeployedInNomad = this.appConfigService.deployedInNomad;

        // remove LLM menu
        if (this.voName === 'vo.imagine-ai.eu') {
            this.catalogLinks = this.catalogLinks.filter(
                (link) => link.name !== 'SIDENAV.LLMS'
            );
        }

        // get the current profile if it already exists
        const currentProfile = this.authService.userProfileSubject.getValue();
        if (currentProfile) {
            this.userProfile = currentProfile;
            this.isAuthorized = currentProfile.isAuthorized;
            this.updateMainLinks();
        }

        // subscribe to receive future updates
        this.authService.userProfileSubject.subscribe((profile) => {
            this.userProfile = profile;
            this.isAuthorized = profile.isAuthorized;
            this.updateMainLinks();
        });
    }

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }

    updateMainLinks() {
        this.catalogLinks.map((link) => {
            if (link.isRestricted) {
                link.isDisabled = !this.isAuthorized;
            }
        });

        this.runtimeLinks.map((link) => {
            if (link.isRestricted) {
                if (link.name === 'SIDENAV.TRY-ME') {
                    link.isDisabled = !this.isLoggedIn();
                } else {
                    link.isDisabled = !this.isAuthorized;
                }
            }
        });

        if (this.dashboardLink.isRestricted) {
            this.dashboardLink.isDisabled = !this.isAuthorized;
        }
    }

    ngAfterViewInit(): void {
        this.sidenavService.setSidenav(this.sidenav);
    }

    toggleSidenav() {
        this.sidenavService.toggle();
    }

    checkScroll(event: Event) {
        const target = event.target as HTMLElement;
        const href = window.location.pathname;
        const catalogRegex = /^\/catalog\/modules$/; // e.g. /catalog/modules
        const catalogElementRegex = /^\/catalog\/modules(?:\/ai4life)?\/[^/]+$/; // e.g. /catalog/modules/<element> or /catalog/modules/ai4life/<element>

        // if the user has scrolled and the page is the modules catalog (/catalog/modules)
        if (target.scrollTop !== 0 && catalogRegex.test(href)) {
            sessionStorage.setItem('scrollTop', target.scrollTop.toString());
            // if the page is a module detail (/catalog/modules/<element>)
        } else if (!catalogElementRegex.test(href)) {
            sessionStorage.setItem('scrollTop', '0');
        }
    }
}
