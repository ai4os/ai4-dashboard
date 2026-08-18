import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

export type BannerDecoration =
    'none' | 'circles' | 'modules' | 'tools' | 'llms';

@Component({
    selector: 'app-ui-banner',
    templateUrl: './ui-banner.component.html',
    styleUrls: ['./ui-banner.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class UiBannerComponent {
    @Input() variant: 'brand' | 'primary' = 'brand';
    @Input() decoration: BannerDecoration = 'circles';
}
