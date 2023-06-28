import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModulesService } from '../../services/modules-service/modules.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-module-test',
  templateUrl: './module-test.component.html',
  styleUrls: ['./module-test.component.scss']
})
export class ModuleTestComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    private modulesService: ModulesService,

    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

  deploymentTitle: string = "";

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      this.modulesService.getModule(params['id']).subscribe(module => {
        this.deploymentTitle = module.title;
      });
    });
  }


}
