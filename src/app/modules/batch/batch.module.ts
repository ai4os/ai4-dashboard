import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchListComponent } from './components/batch-list/batch-list.component';
import { BatchRoutingModule } from './batch-routing.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
    declarations: [BatchListComponent],
    imports: [CommonModule, BatchRoutingModule, SharedModule],
})
export class BatchModule {}
