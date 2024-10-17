import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { TryMeListComponent } from './components/try-me-list/try-me-list.component';
import { TryMeRoutingModule } from './try-me-routing.module';
import { TryMeDetailComponent } from './components/try-me-detail/try-me-detail.component';

@NgModule({
    declarations: [TryMeListComponent, TryMeDetailComponent],
    imports: [CommonModule, TryMeRoutingModule, SharedModule],
})
export class TryMeModule {}
