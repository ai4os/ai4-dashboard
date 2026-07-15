// profile-banner.component.ts
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-profile-banner',
    templateUrl: './profile-banner.component.html',
    styleUrls: ['./profile-banner.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TranslatePipe],
})
export class ProfileBannerComponent {
    @Input() eyebrow = 'ACCOUNT';
    @Input() fullName!: string;
    @Input() email!: string;
    @Input() userId!: string;
}
