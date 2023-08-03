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
import { AuthService } from '@app/core/services/auth/auth.service';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';
import { environment } from 'src/environments/environment';

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
            url: '/',
            isRestricted: true,
            isDisabled: true,
        },
        {
            name: 'SIDENAV.MODULES',
            url: '/marketplace',
        },
        {
            name: 'SIDENAV.DEPLOYMENTS',
            url: '/deployments',
            isRestricted: true,
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
    legalLinks = [
        {
            name: '',
            url: '',
        },
    ];

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }

    ngOnInit(): void {
        this.otherLinks = this.appConfigService.sidenavMenu;
        this.acknowledgments = this.appConfigService.acknowledgments;
        this.projectName = this.appConfigService.projectName;
        this.projectUrl = this.appConfigService.projectUrl;
        this.legalLinks = this.appConfigService.legalLinks;
    }

    ngAfterViewInit(): void {
        this.sidenavService.setSidenav(this.sidenav);
    }

    toggleSidenav() {
        this.sidenavService.toggle();
    }
}
