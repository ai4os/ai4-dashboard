import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-resource-bar',
    templateUrl: './resource-bar.component.html',
    styleUrl: './resource-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class ResourceBarComponent {
    @Input() label = '';
    @Input() used = 0;
    @Input() total = 0;
    @Input() unit = '';
    @Input() color: '1' | '2' | '3' | '4' = '1';

    get pct(): number {
        if (!this.total) return 0;
        return Math.round((this.used / this.total) * 100);
    }
}
