import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { SharedModule } from '@app/shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { HuggingFaceCallbackComponent } from './components/hugging-face-callback/hugging-face-callback.component';
import { Ai4osServicesComponent } from './components/ai4os-services/ai4os-services.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        ProfileComponent,
        HuggingFaceCallbackComponent,
        Ai4osServicesComponent,
    ],
    imports: [CommonModule, ProfileRoutingModule, SharedModule, FormsModule],
})
export class ProfileModule {}
