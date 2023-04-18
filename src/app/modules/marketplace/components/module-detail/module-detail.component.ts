import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { ModulesService } from '../../services/modules-service/modules.service';

@Component({
  selector: 'app-module-detail',
  templateUrl: './module-detail.component.html',
  styleUrls: ['./module-detail.component.scss']
})
export class ModuleDetailComponent implements OnInit {

  constructor(
    private modulesService: ModulesService,
    private authService: AuthService,
    private route: ActivatedRoute
  ){}

  modulesList = []
  module: any = [];


  isLoggedIn(){
    return this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.modulesService.getModule(params['id']).subscribe( module => {
          this.module = module;
          console.log(module)
      })
    });
        
  }



}
