import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-storage-conf-form',
  templateUrl: './storage-conf-form.component.html',
  styleUrls: ['./storage-conf-form.component.scss']
})
export class StorageConfFormComponent implements OnInit{

  constructor(
    private ctrlContainer: FormGroupDirective,
    private fb: FormBuilder
  ){}

  parentForm!: FormGroup;


  storageConfFormGroup = this.fb.group({
    rcloneConfInput: [''],
    storageUrlInput:[''],
    rcloneVendorSelect: [''],
    rcloneUserInput: [''],
    rclonePasswordInput: [''],
  })

  private _defaultFormValues: any;

  @Input() set defaultFormValues(defaultFormValues: any) {
    if(defaultFormValues) {
      this._defaultFormValues = defaultFormValues;
      
      
       this.storageConfFormGroup.get('rcloneConfInput')?.setValue(defaultFormValues.rclone_conf.value)
       this.storageConfFormGroup.get('storageUrlInput')?.setValue(defaultFormValues.rclone_url.value)
       this.storageConfFormGroup.get('rcloneUserInput')?.setValue(defaultFormValues.rclone_user.value)
       defaultFormValues.rclone_vendor.options?.forEach((option: any)  => {
        this.rcloneVendorOptions.push(
          {
            value: option,
            viewValue: option
          }
        )
      }); 
    }
  }



  hidePassword: boolean = true;
  rcloneVendorOptions: any = []

  ngOnInit(): void {
    this.parentForm = this.ctrlContainer.form;
    this.parentForm.addControl("storageConfForm", this.storageConfFormGroup);
  }

}
