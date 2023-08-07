import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModulesService } from '../../services/modules-service/modules.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Service } from '@app/shared/interfaces/module.interface';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from '@app/modules/deployments/components/deployments-list/deployments-list.component';

interface PredictionResult {
  labels: string[],
  probabilities: number[],
  labels_info: string[],
  links: {
    [key: string]: string[];
  }
}

interface PredictionResultItem {
  label: string,
  probability: number,
  label_info: string,
  info: string | undefined,
  images: string | undefined
}

@Component({
  selector: 'app-module-try',
  templateUrl: './module-try.component.html',
  styleUrls: ['./module-try.component.scss'],
})
export class ModuleTryComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    private modulesService: ModulesService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) {}

  @ViewChild('showHelpToggle', { read: ElementRef }) element:
    | ElementRef
    | undefined;

  deploymentTitle: string = '';
  dockerImageName: string = '';
  fileName: string = '';
  token: string = '';
  currentFile?: File;
  predictionData: Array<PredictionResultItem> = [];
  showProgress = false;
  showPrediction = false;
  servicesNames: Array<string> = [];
  serviceList: Array<Service> = [];
  displayedColumns: string[] = ['label', 'probability', 'images', 'info'];
  showHelpForm: FormGroup = this._formBuilder.group({
    showHelpToggleButton: false,
  });

  trymeFormGroup: FormGroup = this._formBuilder.group({
    dockerImageInput: [{ value: '', disabled: true }],
    serviceNameInput: [{ disable: true }],
    inputFile: [''],
    inputText: [''],
    outputType: ['', Validators.required],
  });

  ngOnInit(): void {
    this.openTokenDialog();
    this.route.parent?.params.subscribe((params) => {
      this.modulesService.getModule(params['id']).subscribe((module) => {
        this.deploymentTitle = module.title;
      });

      this.modulesService
        .getModuleConfiguration(params['id'])
        .subscribe((moduleConf) => {
          var moduleGeneral: any = moduleConf.general;
          this.dockerImageName = moduleGeneral.docker_image.value;
          this.trymeFormGroup
            .get('dockerImageInput')
            ?.setValue(this.dockerImageName);
        });
    });
  }

  /**
   * Open dialog requesting OSCAR token
   */
  openTokenDialog(): void {
    const dialogRef = this.dialog.open(DialogOscarToken, {
      data: {
        token: this.token,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.token = result;
      this.modulesService.setToken(result);
      this.loadServices();
    });
  }

  /**
   * On change event that populates the required file value
   * @param event event
   */
  selectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = file.name;

      if (this.currentFile != null) {
        //this.trymeFormGroup.get('inputFile')?.setValue(this.currentFile);
      }
    } else {
      this.currentFile = undefined;
      this.fileName = 'Select File';
    }
  }

  /**
   * Populates the array which has the services that load in the template dropdown.
   */
  loadServices(): void {
    this.modulesService.getServices().subscribe((services) => {
      this.serviceList = services;
      this.servicesNames = this.serviceList
        .filter((service) => service.image == this.dockerImageName)
        .map((service) => service.name);

      if (this.servicesNames.length <= 0) {
        this.servicesNames.push('NO OPTIONS');
      }
      this.setIcon();
    });
  }

  /**
   * Run existing service sending file and service name.
   */
  launchModel(): void {
    this.showProgress = true;
    let serviceName = this.trymeFormGroup.controls['serviceNameInput'].value;

    if (this.currentFile) {
      this.modulesService
        .runService(serviceName, this.currentFile)
        .subscribe((res: PredictionResult) => {
          for (let i = 0; i < res.labels.length; i++) {
            this.predictionData.push({
              label: res.labels[i],
              probability: res.probabilities[i],
              label_info: res.labels_info[i],
              info: res.links['Wikipedia'][i],
              images: res.links['Google Images'][i],
            });
          }
          this.showPrediction = true;
          this.showProgress = false;
          console.log('JSON: ', this.predictionData);
        });
    }
  }

  setIcon() {
    let help: string =
      'M12.094 17.461q.375 0 .633-.258t.258-.633q0-.375-.258-.633t-.633-.258q-.375 0-.633.258t-.258.633q0 .375.258 .633t.633.258Zm-.82-3.422h1.383q0-.609.152-1.113T13.758 11.766q.727-.609 1.031-1.195t.305-1.289q0-1.242-.809-1.992T12.141 6.539q-1.148 0-2.027.574T8.836 8.695l1.242.469q.258-.656.773-1.02t1.219-.363q.797 0 1.289.434t.492 1.113q0 .516-.305.973T12.656 11.25q-.703.609-1.043 1.207T11.273 14.039Zm.727 7.336q-1.922 0-3.633-.738t-2.988-2.016Q4.102 17.344 3.363 15.633T2.625 12q0-1.945.738-3.656t2.016-2.977Q6.656 4.102 8.367 3.363T12 2.625q1.945 0 3.656.738T18.633 5.367q1.266 1.266 2.004 2.977T21.375 12q0 1.922-.738 3.633T18.633 18.621q-1.266 1.277-2.977 2.016T12 21.375Zm0-1.406q3.328 0 5.648-2.332T19.969 12q0-3.328-2.32-5.648t-5.648-2.32q-3.305 0-5.637 2.32T4.031 12q0 3.305 2.332 5.637T12 19.969Zm0-7.969Z';

    if (this.element) {
      this.element.nativeElement
        .querySelector('.mdc-switch__icon--on')
        .firstChild.setAttribute('d', help);
      this.element.nativeElement
        .querySelector('.mdc-switch__icon--off')
        .firstChild.setAttribute('d', help);
    }
  }
}

// Dialog token component (temporal)
@Component({
  selector: 'dialog-oscar-token',
  templateUrl: 'dialog-oscar-token.html',
  standalone: true,
  styleUrls: ['./module-try.component.scss'],
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class DialogOscarToken {
  constructor(
    public dialogRef: MatDialogRef<DialogOscarToken>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
    this.router.navigate(['/modules']);
  }
}
