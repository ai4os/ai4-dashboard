import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { HuggingFaceCallbackComponent } from './components/hugging-face-callback/hugging-face-callback.component';

const routes: Routes = [
    {
        path: '',
        component: ProfileComponent,
    },
    {
        path: 'huggingface-callback',
        component: HuggingFaceCallbackComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProfileRoutingModule {}
