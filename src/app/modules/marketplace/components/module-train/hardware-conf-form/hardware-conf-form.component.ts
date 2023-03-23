import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-hardware-conf-form',
  templateUrl: './hardware-conf-form.component.html',
  styleUrls: ['./hardware-conf-form.component.scss']
})
export class HardwareConfFormComponent {

  constructor(
    private fb: FormBuilder
  ){}

  private _defaultFormValues: any;


  hardwareConfFormGroup = this.fb.group({
    cpuNumberInput: [''],
    gpuNumberInput:[0],
    descriptionInput: [''],
    gpuModelSelect: [''],
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

}
