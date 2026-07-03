import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-ui-loader',
    templateUrl: './ui-loader.component.html',
    styleUrl: './ui-loader.component.scss',
    standalone: false
})
export class UiLoaderComponent {
    @Input() size = 120;
}
