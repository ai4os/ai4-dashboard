import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModuleSummary } from '@app/shared/interfaces/module.interface';
import { ModulesService } from '../../services/modules-service/modules.service';

@Component({
  selector: 'app-modules-list',
  templateUrl: './modules-list.component.html',
  styleUrls: ['./modules-list.component.scss']
})
export class ModulesListComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private modulesService: ModulesService
    ) {}
 
  searchFormGroup!: FormGroup;

  modules: ModuleSummary[] = []

  initializeForm(){
    this.searchFormGroup = this.fb.group({
      search: ''
    })
  }

  getModulesSummaryFromService(){
    this.modulesService.getModulesSummary().subscribe( modules => {
      this.modules = modules;
    })
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getModulesSummaryFromService();
  }


}
