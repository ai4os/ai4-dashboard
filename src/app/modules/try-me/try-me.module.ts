import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TryMeListComponent } from './components/try-me-list/try-me-list.component';
import { TryMeRoutingModule } from './try-me-routing.module';
import { TryMeDetailComponent } from './components/try-me-detail/try-me-detail.component';

@NgModule({
    imports: [
        CommonModule,
        TryMeRoutingModule,
        TryMeListComponent,
        TryMeDetailComponent,
    ],
})
export class TryMeModule {}
