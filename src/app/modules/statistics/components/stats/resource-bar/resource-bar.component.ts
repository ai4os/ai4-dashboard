import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-resource-bar',
    templateUrl: './resource-bar.component.html',
    styleUrl: './resource-bar.component.scss',
})
export class ResourceBarComponent {
    @Input() label: string = '';
    @Input() used: number = 0;
    @Input() total: number = 0;
    @Input() unit: string = '';
    @Input() color: '1' | '2' | '3' | '4' = '1';

    get pct(): number {
        if (!this.total) return 0;
        return Math.round((this.used / this.total) * 100);
    }
}
