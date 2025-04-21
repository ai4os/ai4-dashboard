import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-module-train-view',
    templateUrl: './module-train-view.component.html',
    styleUrl: './module-train-view.component.scss',
})
export class ModuleTrainViewComponent implements OnInit {
    constructor(private route: ActivatedRoute) {}

    protected platform = '';

    ngOnInit(): void {
        const param = history.state.platform ?? 'nomad';
        this.platform = param;
    }
}
