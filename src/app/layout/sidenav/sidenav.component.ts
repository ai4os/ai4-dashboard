import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent  {
  options = this._formBuilder.group({
  bottom: 0,
  fixed: false,
  top: 0,
});

constructor(private _formBuilder: FormBuilder) {}

mainLinks = [
  {
    name: "SIDENAV.DASHBOARD",
    url: "/"
  },
  {
    name: "SIDENAV.MODULES",
    url: "/modules"
  },
  {
    name: "SIDENAV.DEPLOYMENTS",
    url: "/deployments"
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

}
