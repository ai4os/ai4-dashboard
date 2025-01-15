import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-tool-train',
    templateUrl: './tool-train.component.html',
    styleUrls: ['./tool-train.component.scss'],
})
export class ToolTrainComponent implements OnInit {
    constructor(private route: ActivatedRoute) {}

    protected toolID = '';

    ngOnInit(): void {
        this.toolID = this.route.snapshot.parent?.params['id'];
    }
}
