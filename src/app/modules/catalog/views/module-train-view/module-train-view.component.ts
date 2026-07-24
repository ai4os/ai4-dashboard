import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NomadTrainComponent } from '../../components/train/nomad-train/nomad-train.component';
import { OscarTrainComponent } from '../../components/train/oscar-train/oscar-train.component';

@Component({
    selector: 'app-module-train-view',
    templateUrl: './module-train-view.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NomadTrainComponent, OscarTrainComponent],
})
export class ModuleTrainViewComponent implements OnInit {
    protected platform = '';

    ngOnInit(): void {
        const param = history.state.platform ?? 'nomad';
        this.platform = param;
    }
}
