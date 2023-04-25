import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDrawerMode, MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '@app/core/services/auth/auth.service';
import { SidenavService } from '@app/shared/services/sidenav/sidenav.service';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  @ViewChild('sidenav', {static:true}) public sidenav!: MatSidenav;

  constructor(
    private _formBuilder: FormBuilder,
    protected authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private sidenavService: SidenavService
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 1366px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener)
  }

  options = this._formBuilder.group({
    bottom: 0,
    fixed: false,
    top: 0,
  });

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  mainLinks = [
    {
      name: "SIDENAV.DASHBOARD",
      url: "/",
      isRestricted: true, 
      isDisabled: true,
    },
    {
      name: "SIDENAV.MODULES",
      url: "/modules"
    },
    {
      name: "SIDENAV.DEPLOYMENTS",
      url: "/deployments",
      isRestricted: true
    }
  ]

  otherLinks = [
    {
      name: "SIDENAV.IAM",
      url: "https://iam.deep-hybrid-datacloud.eu"
    },
    {
      name: "SIDENAV.DEEP-MARKETPLACE",
      url: "https://marketplace.deep-hybrid-datacloud.eu"
    },
    {
      name: "SIDENAV.DEEP-DOCUMENTATION",
      url: "https://docs.deep-hybrid-datacloud.eu"
    },
    {
      name: "SIDENAV.PROJECT-PAGE",
      url: "https://deep-hybrid-datacloud.eu"
    }
  ]

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

}
