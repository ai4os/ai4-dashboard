import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { ModulesService } from '../../services/modules-service/modules.service';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-module-detail',
  templateUrl: './module-detail.component.html',
  styleUrls: ['./module-detail.component.scss']
})
export class ModuleDetailComponent implements OnInit {

  constructor(
    private modulesService: ModulesService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ){}

  modulesList = []
  module: any = [];

  isLoading: boolean = false;


  isLoggedIn(){
    return this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.isLoading = true;
      this.modulesService.getModule(params['id']).subscribe( module => {
        this.isLoading = false;
        this.module = module;
        console.log("Module")
        this.breadcrumbService.set('@moduleName', module.title)
      })
    });
        
  }



}
