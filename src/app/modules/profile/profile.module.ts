import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { SharedModule } from '@app/shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { HuggingFaceCallbackComponent } from './components/hugging-face-callback/hugging-face-callback.component';
import { FormsModule } from '@angular/forms';
import { ApiKeysComponent } from './components/api-keys/api-keys.component';
import { ApiKeyPopupComponent } from './components/api-key-popup/api-key-popup.component';
import { ProfileBannerComponent } from './components/profile-banner/profile-banner.component';
import { OverviewTabComponent } from './components/tabs/overview-tab/overview-tab.component';
import { ServicesTabComponent } from './components/tabs/services-tab/services-tab.component';
import { ServiceCardComponent } from './components/service-card/service-card.component';

@NgModule({
    declarations: [
        ProfileComponent,
        HuggingFaceCallbackComponent,
        ApiKeysComponent,
        ApiKeyPopupComponent,
        ProfileBannerComponent,
        OverviewTabComponent,
        ServicesTabComponent,
        ServiceCardComponent,
    ],
    imports: [CommonModule, ProfileRoutingModule, SharedModule, FormsModule],
})
export class ProfileModule {}
