import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DeploymentsService } from '@app/modules/deployments/services/deployments.service';
import { TrainModuleRequest } from '@app/shared/interfaces/module.interface';
import { ModulesService } from '../../services/modules-service/modules.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-module-train',
  templateUrl: './module-train.component.html',
  styleUrls: ['./module-train.component.scss']
})
export class ModuleTrainComponent implements OnInit {

  constructor(
    private _formBuilder: FormBuilder,
    private modulesService: ModulesService,
    private deploymentsService: DeploymentsService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private router: Router,
    private _location: Location
  ) { }

  generalConfForm: FormGroup = this._formBuilder.group({
  });
  hardwareConfForm: FormGroup = this._formBuilder.group({
  });
  storageConfForm: FormGroup = this._formBuilder.group({
  });

  deploymentTitle: string = "";

  generalConfDefaultValues: any;
  hardwareConfDefaultValues: any;
  storageConfDefaultValues: any;

  submitTrainingRequest() {
    let request: TrainModuleRequest;
    request = {
      general: {
        title: this.generalConfForm.value.generalConfForm.titleInput,
        desc: this.generalConfForm.value.generalConfForm.descriptionInput,
        docker_image: this.generalConfForm.getRawValue().generalConfForm.dockerImageInput,
        docker_tag: this.generalConfForm.value.generalConfForm.dockerTagSelect,
        service: this.generalConfForm.value.generalConfForm.commandSelect,
        jupyter_password: this.generalConfForm.getRawValue().generalConfForm.jupyterLabPassInput
      },
      hardware: {
        cpu_num: this.hardwareConfForm.value.hardwareConfForm.cpuNumberInput,
        ram: this.hardwareConfForm.value.hardwareConfForm.ramMemoryInput,
        disk: this.hardwareConfForm.value.hardwareConfForm.diskMemoryInput,
        gpu_num: this.hardwareConfForm.value.hardwareConfForm.gpuNumberInput,
      },
      storage: {
        rclone_conf: this.storageConfForm.value.storageConfForm.rcloneConfInput,
        rclone_url: this.storageConfForm.value.storageConfForm.storageUrlInput,
        rclone_vendor: this.storageConfForm.value.storageConfForm.rcloneVendorSelect,
        rclone_user: this.storageConfForm.value.storageConfForm.rcloneUserInput,
        rclone_password: this.storageConfForm.value.storageConfForm.rclonePasswordInput,
      }

    }

    this.deploymentsService.postTrainModule(request).subscribe({
      next: (result: any) => {
        if (result && result.status == 'success') {
          this.router.navigate(['/deployments']).then((navigated: boolean) => {
            if (navigated) {
              this._snackBar.open("Deployment created with ID" + result.job_id, "X",  {
                duration: 3000,
                panelClass: ['primary-snackbar']
            })
            }
          });
        } else {
          if (result && result.status == 'fail') {
            this._snackBar.open("Error while creating the deployment" + result.error_msg, "X",  {
              duration: 3000,
              panelClass: ['red-snackbar']
          })
          }
        }
      }
    }
    )
  }

  ngOnInit(): void {

    this.route.parent?.params.subscribe(params => {
      this.modulesService.getModule(params['id']).subscribe(module => {
        this.deploymentTitle = module.title;
      })
      this.modulesService.getModuleConfiguration(params['id']).subscribe(moduleConf => {
        this.generalConfDefaultValues = moduleConf.general
        this.hardwareConfDefaultValues = moduleConf.hardware
        this.storageConfDefaultValues = moduleConf.storage
      })
    });
  }

}
