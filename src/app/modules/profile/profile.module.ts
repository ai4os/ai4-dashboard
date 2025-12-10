import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { SharedModule } from '@app/shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { HuggingFaceCallbackComponent } from './components/hugging-face-callback/hugging-face-callback.component';
import { Ai4eoscServicesComponent } from './components/ai4eosc-services/ai4eosc-services.component';
import { FormsModule } from '@angular/forms';
import { ApiKeysComponent } from './components/api-keys/api-keys.component';
import { ApiKeyPopupComponent } from './components/api-key-popup/api-key-popup.component';

@NgModule({
    declarations: [
        ProfileComponent,
        HuggingFaceCallbackComponent,
        Ai4eoscServicesComponent,
        ApiKeysComponent,
        ApiKeyPopupComponent,
    ],
    imports: [CommonModule, ProfileRoutingModule, SharedModule, FormsModule],
})
export class ProfileModule {}
