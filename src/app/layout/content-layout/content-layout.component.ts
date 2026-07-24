import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
    selector: 'app-content-layout',
    templateUrl: './content-layout.component.html',
    styleUrls: ['./content-layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [SidenavComponent],
})
export class ContentLayoutComponent {}
