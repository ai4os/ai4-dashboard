import { Component, computed, inject, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { AuthService } from '@app/core/services/auth/auth.service';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';
import { environment } from '@environments/environment';

@Component({
    selector: 'app-top-navbar',
    templateUrl: './top-navbar.component.html',
    styleUrls: ['./top-navbar.component.scss'],
})
export class TopNavbarComponent implements OnInit {
    private authService = inject(AuthService);
    private sidenavService = inject(SidenavService);
    protected appConfigService = inject(AppConfigService);
    private breakpointObserver = inject(BreakpointObserver);

    protected environment = environment;
    voName = '';

    protected userProfile = toSignal(this.authService.userProfile$);

    protected hideSidebarMatch = toSignal(
        this.breakpointObserver.observe('(max-width: 1366px)')
    );
    protected isSidebarHidden = computed(
        () => this.hideSidebarMatch()?.matches ?? false
    );

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

    isAuthorized(): boolean {
        return !!this.userProfile()?.isAuthorized;
    }

    toggleSidenav() {
        this.sidenavService.toggle();
    }
}
