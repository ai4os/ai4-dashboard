import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-ui-loader',
    templateUrl: './ui-loader.component.html',
    styleUrl: './ui-loader.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class UiLoaderComponent {
    @Input() size = 120;
}
