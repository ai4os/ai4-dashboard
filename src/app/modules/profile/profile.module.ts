import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { SharedModule } from '@app/shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { HuggingFaceCallbackComponent } from './components/hugging-face-callback/hugging-face-callback.component';

@NgModule({
    declarations: [ProfileComponent, HuggingFaceCallbackComponent],
    imports: [CommonModule, ProfileRoutingModule, SharedModule],
})
export class ProfileModule {}
