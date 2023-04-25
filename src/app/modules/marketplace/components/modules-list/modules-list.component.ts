import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModuleSummary } from '@app/shared/interfaces/module.interface';
import { TranslateService } from '@ngx-translate/core';
import { ModulesService } from '../../services/modules-service/modules.service';

@Component({
  selector: 'app-modules-list',
  templateUrl: './modules-list.component.html',
  styleUrls: ['./modules-list.component.scss']
})
export class ModulesListComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private modulesService: ModulesService,
  ) { }

  searchFormGroup!: FormGroup;
  isLoading: boolean = false;

  modules: ModuleSummary[] = []

  moduleType: "development" | "model" = "model"

  initializeForm() {
    this.searchFormGroup = this.fb.group({
      search: ''
    })
  }

  getModulesSummaryFromService() {
    this.isLoading = true;
    this.modulesService.getModulesSummary().subscribe({
      next: modules => {
        this.isLoading = false;
        this.modules = modules;
      },
      error: () => {
        setTimeout(() =>
          this.isLoading = false
          , 3000);
      }
    })
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getModulesSummaryFromService();
  }


}
