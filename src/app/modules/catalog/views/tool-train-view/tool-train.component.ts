import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-tool-train',
    templateUrl: './tool-train.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
})
export class ToolTrainComponent implements OnInit {
    constructor(private route: ActivatedRoute) {}

    protected toolID = '';

    ngOnInit(): void {
        this.toolID = this.route.snapshot.parent?.params['id'];
    }
}
