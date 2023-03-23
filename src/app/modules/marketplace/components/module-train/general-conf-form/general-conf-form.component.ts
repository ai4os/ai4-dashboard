import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-general-conf-form',
  templateUrl: './general-conf-form.component.html',
  styleUrls: ['./general-conf-form.component.scss']
})
export class GeneralConfFormComponent implements OnInit {

  constructor(
    private fb: FormBuilder
  ){}

  private _defaultFormValues: any;

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
    jupyterLabPassInput: ['', [Validators.required, Validators.minLength(9)]],
    dockerImageInput: [{value: '', disabled: true}],
    dockerTagSelect: ['']
  })

  commandOptions = [
    {value: "deepaas", viewValue: "DEEPaaS"},
    {value: "jupyterlab", viewValue: "JupyterLab"},
  ]
  dockerTagOptions: {value: string, viewValue: string}[] = []

  ngOnInit(): void {


    this.generalConfFormGroup.get('commandSelect')?.valueChanges.subscribe(val => {
      this.isJupyterLab = val === 'jupyterlab' ? true : false
      
    })
  }


}
