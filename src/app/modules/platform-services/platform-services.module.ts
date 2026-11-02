import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformServicesListComponent } from './platform-services-list/platform-services-list.component';
import { PlatformServicesRoutingModule } from './platform-services-routing.module';

@NgModule({
    imports: [
        CommonModule,
        PlatformServicesRoutingModule,
        PlatformServicesListComponent,
    ],
})
export class PlatformServicesModule {}
