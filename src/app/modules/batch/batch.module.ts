import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchListComponent } from './components/batch-list/batch-list.component';
import { BatchRoutingModule } from './batch-routing.module';

@NgModule({
    imports: [CommonModule, BatchRoutingModule, BatchListComponent],
})
export class BatchModule {}
