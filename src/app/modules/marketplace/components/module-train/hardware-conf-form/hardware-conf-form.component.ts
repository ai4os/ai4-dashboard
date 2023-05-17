import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-hardware-conf-form',
  templateUrl: './hardware-conf-form.component.html',
  styleUrls: ['./hardware-conf-form.component.scss']
})
export class HardwareConfFormComponent implements OnInit{

  constructor(
    private ctrlContainer: FormGroupDirective,
    private fb: FormBuilder
  ){}

  parentForm!: FormGroup;

  private _defaultFormValues: any;

  isGpuModelSelectDisabled: boolean = true;
 //this.hardwareConfFormGroup.get('gpuNumberInput')?.value! < 1

  hardwareConfFormGroup = this.fb.group({
    cpuNumberInput: [''],
    gpuNumberInput:[0],
    descriptionInput: [''],
    gpuModelSelect: [{value: '', disabled: true}, [Validators.required]],
    ramMemoryInput: [''],
    diskMemoryInput: [''],
  })



  @Input() set defaultFormValues(defaultFormValues: any) {
    if(defaultFormValues) {
      this._defaultFormValues = defaultFormValues;
      
       this.hardwareConfFormGroup.get('cpuNumberInput')?.setValue(defaultFormValues.cpu_num.value)
       this.hardwareConfFormGroup.get('gpuNumberInput')?.setValue(defaultFormValues.gpu_num.value)
       this.hardwareConfFormGroup.get('ramMemoryInput')?.setValue(defaultFormValues.ram.value)
       this.hardwareConfFormGroup.get('diskMemoryInput')?.setValue(defaultFormValues.disk.value)
      defaultFormValues.gpu_type.options?.forEach((tag: any)  => {
        this.gpuModelOptions.push(
          {
            value: tag,
            viewValue: tag
          }
        )
      });
      this.hardwareConfFormGroup.get('gpuModelSelect')?.setValue(defaultFormValues.gpu_type.value)
    }
  }



  gpuModelOptions: {value: string, viewValue: string}[] = []

  /**
   * Method to handle wether the gpuNumberSelector should be disabled or not.
   */
  gpuNumberSelectorBehaviourHandler(){
    let gpuNumberInputControl = this.hardwareConfFormGroup.get('gpuNumberInput')?.value;

    if(typeof gpuNumberInputControl == 'number' && gpuNumberInputControl > 0){
        this.isGpuModelSelectDisabled = false;
    }
    this.hardwareConfFormGroup.get('gpuNumberInput')?.valueChanges.subscribe((value: any) => {
      if(value > 0){
        this.isGpuModelSelectDisabled = false;
        this.hardwareConfFormGroup.get('gpuModelSelect')?.enable()
      }else{
        this.hardwareConfFormGroup.get('gpuModelSelect')?.disable()
      }
    })
  }

  ngOnInit(): void {
    this.parentForm = this.ctrlContainer.form;
    this.parentForm.addControl("hardwareConfForm", this.hardwareConfFormGroup);
    this.gpuNumberSelectorBehaviourHandler()
    
  }

}
