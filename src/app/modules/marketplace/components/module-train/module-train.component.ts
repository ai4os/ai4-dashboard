import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModulesService } from '../../services/modules-service/modules.service';

@Component({
  selector: 'app-module-train',
  templateUrl: './module-train.component.html',
  styleUrls: ['./module-train.component.scss']
})
export class ModuleTrainComponent implements OnInit{
  
  constructor(
    private _formBuilder: FormBuilder,
    private modulesService: ModulesService,
    private route: ActivatedRoute
    ) {}


  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  generalConfDefaultValues: any;
  hardwareConfDefaultValues: any;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.modulesService.getModuleConfiguration(params['id']).subscribe(moduleConf => {
        this.generalConfDefaultValues = moduleConf.general
        this.hardwareConfDefaultValues = moduleConf.hardware
      })
      
    });
    
  }

}
