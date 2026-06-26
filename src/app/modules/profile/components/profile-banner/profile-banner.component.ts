// profile-banner.component.ts
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-profile-banner',
    templateUrl: './profile-banner.component.html',
    styleUrls: ['./profile-banner.component.scss'],
})
export class ProfileBannerComponent {
    @Input() eyebrow = 'ACCOUNT';
    @Input() fullName!: string;
    @Input() email!: string;
    @Input() userId!: string;
}
