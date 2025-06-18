import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService, UserProfile } from '@app/core/services/auth/auth.service';
import { ChatOverlayService } from '@app/shared/services/chat-overlay/chat-overlay.service';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';
import { environment } from '@environments/environment';

@Component({
    selector: 'app-top-navbar',
    templateUrl: './top-navbar.component.html',
    styleUrls: ['./top-navbar.component.scss'],
})
export class TopNavbarComponent implements OnInit {
    constructor(
        private readonly authService: AuthService,
        private changeDetectorRef: ChangeDetectorRef,
        private media: MediaMatcher,
        private sidenavService: SidenavService,
        protected appConfigService: AppConfigService
    ) {
        this._hideSidebarQueryListener = () => {
            changeDetectorRef.detectChanges();
        };
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.hideSidebarQuery = this.media.matchMedia('(max-width: 1366px)');
        this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
        this.hideSidebarQuery.addEventListener(
            'change',
            this._hideSidebarQueryListener
        );
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);
        authService.userProfileSubject.subscribe((profile) => {
            this.userProfile = profile;
        });
    }

    private _hideSidebarQueryListener: () => void;
    private _mobileQueryListener: () => void;
    protected environment = environment;
    hideSidebarQuery: MediaQueryList;
    mobileQuery: MediaQueryList;
    userProfile?: UserProfile;
    voName = '';

    ngOnInit(): void {
        this.voName = this.appConfigService.voName;
    }

    login() {
        this.authService.login(window.location.pathname);
    }

    logout() {
        this.authService.logout();
    }

    isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }

    isAuthorized() {
        return this.userProfile?.isAuthorized;
    }

    toggleSidenav() {
        this.sidenavService.toggle();
    }
}
