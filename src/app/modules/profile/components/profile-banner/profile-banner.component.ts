import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { UiBannerComponent } from '@app/shared/components/ui/ui-banner/ui-banner.component';

@Component({
    selector: 'app-profile-banner',
    templateUrl: './profile-banner.component.html',
    styleUrls: ['./profile-banner.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TranslatePipe, UiBannerComponent],
})
export class ProfileBannerComponent {
    @Input() eyebrow = 'ACCOUNT';
    @Input() fullName!: string;
    @Input() email!: string;
    @Input() userId!: string;
}
