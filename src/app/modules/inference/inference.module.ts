import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { InferencesListComponent } from './components/inferences-list/inferences-list.component';
import { InferenceRoutingModule } from './inference-routing.module';
import { InferenceDetailComponent } from './components/inference-detail/inference-detail.component';
import { DeploymentsModule } from '../deployments/deployments.module';

@NgModule({
    declarations: [InferencesListComponent, InferenceDetailComponent],
    imports: [
        CommonModule,
        InferenceRoutingModule,
        SharedModule,
        DeploymentsModule,
    ],
})
export class InferenceModule {}
