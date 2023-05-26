import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DeploymentsService } from '@app/modules/deployments/services/deployments.service';
import { TrainModuleRequest } from '@app/shared/interfaces/module.interface';
import { ModulesService } from '../../services/modules-service/modules.service';
import { Location } from '@angular/common';

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
    private _location: Location,
    private renderer: Renderer2
  ) { }

  @ViewChild('showHelpToggle', { read: ElementRef }) element: ElementRef | undefined;

  checked = false;
  disabled = false;

  generalConfForm: FormGroup = this._formBuilder.group({
  });
  hardwareConfForm: FormGroup = this._formBuilder.group({
  });
  storageConfForm: FormGroup = this._formBuilder.group({
  });
  showHelpForm: FormGroup = this._formBuilder.group({
    showHelpToggleButton: false
  })

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
        gpu_type: this.hardwareConfForm.value.hardwareConfForm.gpuModelSelect
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
              this._snackBar.open("Deployment created with ID" + result.job_id, "X", {
                duration: 3000,
                panelClass: ['primary-snackbar']
              })
            }
          });
        } else {
          if (result && result.status == 'fail') {
            this._snackBar.open("Error while creating the deployment" + result.error_msg, "X", {
              duration: 3000,
              panelClass: ['red-snackbar']
            })
          }
        }
      }
    }
    )
  }/**
   * Change toggle button icon by DOM manipulation
   *
   * @memberof ModuleTrainComponent
   */
  setIcon() {
    let help: string = 'M12.094 17.461q.375 0 .633-.258t.258-.633q0-.375-.258-.633t-.633-.258q-.375 0-.633.258t-.258.633q0 .375.258 .633t.633.258Zm-.82-3.422h1.383q0-.609.152-1.113T13.758 11.766q.727-.609 1.031-1.195t.305-1.289q0-1.242-.809-1.992T12.141 6.539q-1.148 0-2.027.574T8.836 8.695l1.242.469q.258-.656.773-1.02t1.219-.363q.797 0 1.289.434t.492 1.113q0 .516-.305.973T12.656 11.25q-.703.609-1.043 1.207T11.273 14.039Zm.727 7.336q-1.922 0-3.633-.738t-2.988-2.016Q4.102 17.344 3.363 15.633T2.625 12q0-1.945.738-3.656t2.016-2.977Q6.656 4.102 8.367 3.363T12 2.625q1.945 0 3.656.738T18.633 5.367q1.266 1.266 2.004 2.977T21.375 12q0 1.922-.738 3.633T18.633 18.621q-1.266 1.277-2.977 2.016T12 21.375Zm0-1.406q3.328 0 5.648-2.332T19.969 12q0-3.328-2.32-5.648t-5.648-2.32q-3.305 0-5.637 2.32T4.031 12q0 3.305 2.332 5.637T12 19.969Zm0-7.969Z'

    if (this.element) {
      this.element.nativeElement.querySelector('.mdc-switch__icon--on').firstChild.setAttribute('d', help);
      this.element.nativeElement.querySelector('.mdc-switch__icon--off').firstChild.setAttribute('d', help);
    }
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

  ngAfterViewInit() {
    this.setIcon();
  }
}
