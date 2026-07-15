import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForbiddenRoutingModule } from './forbidden-routing.module';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';

@NgModule({
    imports: [CommonModule, ForbiddenRoutingModule, ForbiddenComponent],
})
export class ForbiddenModule {}
