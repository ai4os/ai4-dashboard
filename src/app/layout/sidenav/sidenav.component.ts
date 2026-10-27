import { MediaMatcher } from '@angular/cdk/layout';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewChild,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
} from '@angular/material/sidenav';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';
import { environment } from '@environments/environment';
import { gitInfo } from '@environments/version';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { TopNavbarComponent } from '../top-navbar/top-navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { TranslatePipe } from '@ngx-translate/core';
import { UiButtonComponent } from '@app/shared/components/ui/ui-button/ui-button.component';

export interface ProjectLink {
    name: string;
    url: string;
    icon?: string;
    id?: string;
    emphasis?: boolean;
    isRestricted?: boolean;
    isDisabled?: boolean;
    tooltip?: string;
}

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatSidenavContainer,
        MatSidenav,
        MatIcon,
        RouterLink,
        MatTooltip,
        RouterLinkActive,
        MatSidenavContent,
        NgClass,
        NgTemplateOutlet,
        TopNavbarComponent,
        RouterOutlet,
        FooterComponent,
        TranslatePipe,
        UiButtonComponent,
    ],
})
export class SidenavComponent implements OnInit, AfterViewInit {
    private readonly _formBuilder = inject(FormBuilder);
    protected authService = inject(AuthService);
    private readonly changeDetectorRef = inject(ChangeDetectorRef);
    private readonly media = inject(MediaMatcher);
    private readonly sidenavService = inject(SidenavService);
    private readonly appConfigService = inject(AppConfigService);

    constructor() {
        const changeDetectorRef = this.changeDetectorRef;

        this.mobileQuery = this.media.matchMedia('(max-width: 1366px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    @ViewChild('sidenav', { static: true }) public sidenav!: MatSidenav;

    public isAuthorized = false;
    public isAuthenticated = false;
    public isProjectMember = false;
    protected environment = environment;
    protected gitInfo = gitInfo;
    protected userProfile?: UserProfile;

    options = this._formBuilder.group({
        bottom: 0,
        fixed: false,
        top: 0,
    });

    mobileQuery: MediaQueryList;
    private readonly _mobileQueryListener: () => void;

    userStatsLink: ProjectLink = {
        name: 'SIDENAV.USER',
        url: '/statistics/user',
        icon: 'account_circle',
    };

    platformStatsLink: ProjectLink = {
        name: 'SIDENAV.PLATFORM',
        url: '/statistics/platform',
        icon: 'public',
    };

    catalogLinks: ProjectLink[] = [
        {
            name: 'SIDENAV.MODULES',
            url: '/catalog/modules',
            icon: 'inventory_2',
        },
        {
            name: 'SIDENAV.TOOLS',
            url: '/catalog/tools',
            icon: 'build',
        },
        {
            name: 'SIDENAV.LLMS',
            url: '/catalog/llms',
            icon: 'forum',
        },
    ];

    runtimeLinks: ProjectLink[] = [
        {
            name: 'SIDENAV.TRY-ME',
            url: '/tasks/try-me',
            icon: 'play_circle',
            isRestricted: true,
            isDisabled: !this.isAuthorized,
            tooltip: 'ERRORS.NO-DEMO-ROLE',
        },
        {
            name: 'SIDENAV.DEPLOYMENTS',
            url: '/tasks/deployments',
            icon: 'upload',
            id: 'step2',
            isRestricted: true,
            isDisabled: !this.isProjectMember,
        },
        {
            name: 'SIDENAV.BATCH',
            url: '/tasks/batch',
            icon: 'layers',
            id: 'step3',
            isRestricted: true,
            isDisabled: !this.isProjectMember,
        },
        {
            name: 'SIDENAV.INFERENCE',
            url: '/tasks/inference',
            icon: 'emoji_objects',
            isRestricted: true,
            isDisabled: !this.isProjectMember,
        },
    ];

    platformServicesLink: ProjectLink = {
        name: 'SIDENAV.PLATFORM-SERVICES',
        url: '/platform-services',
        icon: 'dns',
    };

    acknowledgments = '';
    projectName = '';
    projectUrl = '';
    voName = '';
    isDeployedInNomad = '';

    ngOnInit(): void {
        // save config and check vo
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
            this.isAuthenticated = currentProfile.isAuthenticated;
            this.isProjectMember = currentProfile.isProjectMember;
            this.updateMainLinks();
        }

        // subscribe to receive future updates
        this.authService.userProfile$.subscribe((profile) => {
            if (profile) {
                this.userProfile = profile;
                this.isAuthorized = profile.isAuthorized;
                this.isAuthenticated = profile.isAuthenticated;
                this.isProjectMember = profile.isProjectMember;
                this.updateMainLinks();
                this.changeDetectorRef.detectChanges();
            }
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
                    link.isDisabled = !this.isAuthorized;
                } else {
                    link.isDisabled = !this.isProjectMember;
                }
            }
        });
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
