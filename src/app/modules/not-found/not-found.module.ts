import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundRoutingModule } from './not-found-routing.module';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
    declarations: [NotFoundComponent],
    imports: [CommonModule, NotFoundRoutingModule, SharedModule],
})
export class NotFoundModule {}
