import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InferencesListComponent } from './components/inferences-list/inferences-list.component';
import { InferenceRoutingModule } from './inference-routing.module';
import { InferenceDetailComponent } from './components/inference-detail/inference-detail.component';
import { DeploymentsModule } from '../deployments/deployments.module';

@NgModule({
    imports: [
        CommonModule,
        InferenceRoutingModule,
        DeploymentsModule,
        InferencesListComponent,
        InferenceDetailComponent,
    ],
})
export class InferenceModule {}
