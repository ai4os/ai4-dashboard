import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-module-train-view',
    templateUrl: './module-train-view.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class ModuleTrainViewComponent implements OnInit {
    protected platform = '';

    ngOnInit(): void {
        const param = history.state.platform ?? 'nomad';
        this.platform = param;
    }
}
