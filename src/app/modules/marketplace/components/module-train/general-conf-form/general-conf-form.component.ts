import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-general-conf-form',
  templateUrl: './general-conf-form.component.html',
  styleUrls: ['./general-conf-form.component.scss']
})
export class GeneralConfFormComponent implements OnInit {

  constructor(
    private ctrlContainer: FormGroupDirective,
    private fb: FormBuilder
  ){}

  parentForm!: FormGroup;

  protected _defaultFormValues: any;
  protected _showHelp: any;
  
  @Input() set showHelp(showHelp: any){
      this._showHelp = showHelp;
  }

  @Input() set defaultFormValues(defaultFormValues: any) {
    if(defaultFormValues) {
      this._defaultFormValues = defaultFormValues;
      this.generalConfFormGroup.get('dockerImageInput')?.setValue(defaultFormValues.docker_image.value)
      defaultFormValues.docker_tag.options?.forEach((tag: any)  => {
        this.dockerTagOptions.push(
          {
            value: tag,
            viewValue: tag
          }
        )
      });
      this.generalConfFormGroup.get('dockerTagSelect')?.setValue(defaultFormValues.docker_tag.value)
    }
  }

 
  isJupyterLab: boolean = false;
  hidePassword: boolean = true;

  generalConfFormGroup = this.fb.group({
    descriptionInput: [''],
    commandSelect: ['deepaas'],
    titleInput: ['', [Validators.required, Validators.maxLength(45)]],
    jupyterLabPassInput: [{value: '', disabled: true}, [Validators.required, Validators.minLength(9)]],
    dockerImageInput: [{value: '', disabled: true}],
    dockerTagSelect: ['']
  })

  commandOptions = [
    {value: "deepaas", viewValue: "DEEPaaS"},
    {value: "jupyterlab", viewValue: "JupyterLab"},
  ]
  dockerTagOptions: {value: string, viewValue: string}[] = []

  ngOnInit(): void {    
    this.parentForm = this.ctrlContainer.form;
    this.parentForm.addControl("generalConfForm", this.generalConfFormGroup);

    this.generalConfFormGroup.get('commandSelect')?.valueChanges.subscribe(val => {
      this.isJupyterLab = val === 'jupyterlab' ? true : false;
      if(this.isJupyterLab){
        this.generalConfFormGroup.get('jupyterLabPassInput')?.enable();
      }else{
        this.generalConfFormGroup.get('jupyterLabPassInput')?.disable();
      }
      
    })
  }


}
