import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModulesService } from '../../services/modules-service/modules.service';

@Component({
  selector: 'app-module-detail',
  templateUrl: './module-detail.component.html',
  styleUrls: ['./module-detail.component.scss']
})
export class ModuleDetailComponent implements OnInit {

  constructor(
    private modulesService: ModulesService,
    private route: ActivatedRoute
  ){}

  modulesList = []
  module: any;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params)
      this.modulesService.getModule(params['id']).subscribe( module => {
        
          this.module = module;

      })
    });
        
  }



}
