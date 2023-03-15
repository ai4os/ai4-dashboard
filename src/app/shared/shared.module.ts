import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports: [
    ReactiveFormsModule,
    MaterialModule,
    RouterModule
  ]
})
export class SharedModule { }
