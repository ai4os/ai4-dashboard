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
import { Router } from '@angular/router';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';
import { environment } from 'src/environments/environment';
import { gitInfo } from 'src/environments/version';

@Component({
    selector: 'app-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, AfterViewInit {
    @ViewChild('sidenav', { static: true }) public sidenav!: MatSidenav;

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

    protected environment = environment;
    protected gitInfo = gitInfo;
    protected userProfile?: UserProfile;
    public isAuthorized = false;

    options = this._formBuilder.group({
        bottom: 0,
        fixed: false,
        top: 0,
    });

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    mainLinks = [
        {
            name: 'SIDENAV.DASHBOARD',
            url: '/dashboard',
            isRestricted: true,
            isDisabled: !this.isAuthorized,
        },
        {
            name: 'SIDENAV.MODULES',
            url: '/marketplace',
        },
        {
            name: 'SIDENAV.TRY-ME',
            url: '/try-me',
            isRestricted: true,
            isDisabled: !this.isLoggedIn(),
        },
        {
            name: 'SIDENAV.DEPLOYMENTS',
            url: '/deployments',
            isRestricted: true,
            isDisabled: !this.isAuthorized,
        },
        {
            name: 'SIDENAV.INFERENCE',
            url: '/inference',
            isRestricted: true,
            isDisabled: !this.isAuthorized,
        },
    ];

    otherLinks = [
        {
            name: 'SIDENAV.IAM',
            url: 'https://aai.egi.eu/',
        },
    ];

    acknowledgments = '';
    projectName = '';
    projectUrl = '';
    voName = '';
    legalLinks = [
        {
            name: '',
            url: '',
        },
    ];
    isDeployedInNomad = '';

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }

    ngOnInit(): void {
        this.authService.userProfileSubject.subscribe((profile) => {
            this.userProfile = profile;
            this.isAuthorized = profile.isAuthorized;
            this.updateMainLinks();
        });

        this.otherLinks = this.appConfigService.sidenavMenu;
        this.acknowledgments = this.appConfigService.acknowledgments;
        this.projectName = this.appConfigService.projectName;
        this.projectUrl = this.appConfigService.projectUrl;
        this.voName = this.appConfigService.voName;
        this.legalLinks = this.appConfigService.legalLinks;
        this.isDeployedInNomad = this.appConfigService.deployedInNomad;
    }

    updateMainLinks() {
        this.mainLinks.map((link) => {
            if (link.isRestricted) {
                if (link.name === 'SIDENAV.TRY-ME') {
                    link.isDisabled = !this.isLoggedIn();
                } else {
                    link.isDisabled = !this.isAuthorized;
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
        const href = window.location.href;
        const marketplaceRegex = /\/marketplace$/;
        const marketplaceElementRegex = /\/marketplace\//;

        // if the user has scrolled and the page is the main marketplace (/marketplace)
        if (target.scrollTop !== 0 && marketplaceRegex.test(href)) {
            sessionStorage.setItem('scrollTop', target.scrollTop.toString());
            // if the page is a module detail (/marketplace/*)
        } else if (!marketplaceElementRegex.test(href)) {
            sessionStorage.setItem('scrollTop', '0');
        }
    }
}
