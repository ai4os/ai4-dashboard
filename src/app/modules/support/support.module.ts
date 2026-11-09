import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportListComponent } from './support-list/support-list.component';
import { SupportRoutingModule } from './support-routing.module';

@NgModule({
    imports: [CommonModule, SupportRoutingModule, SupportListComponent],
})
export class SupportModule {}
