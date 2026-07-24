import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    templateUrl: './module-detail-view.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterOutlet],
})
export class ModuleDetailViewComponent {}
