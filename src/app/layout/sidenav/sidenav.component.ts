import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '@app/core/services/auth/auth.service';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  options = this._formBuilder.group({
    bottom: 0,
    fixed: false,
    top: 0,
  });

  constructor(
    private _formBuilder: FormBuilder,
    protected authService: AuthService
  ) { }

  mainLinks = [
    {
      name: "SIDENAV.DASHBOARD",
      url: "/",
      isRestricted: true
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


}
