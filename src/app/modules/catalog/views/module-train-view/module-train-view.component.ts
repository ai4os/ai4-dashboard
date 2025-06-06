import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-module-train-view',
    templateUrl: './module-train-view.component.html',
})
export class ModuleTrainViewComponent implements OnInit {
    constructor() {}

    protected platform = '';

    ngOnInit(): void {
        const param = history.state.platform ?? 'nomad';
        this.platform = param;
    }
}
