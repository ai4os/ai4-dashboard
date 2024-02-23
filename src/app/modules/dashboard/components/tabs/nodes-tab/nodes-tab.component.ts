import { Component, Input } from '@angular/core';
import { NodeStats } from '@app/shared/interfaces/stats.interface';

@Component({
    selector: 'app-nodes-tab',
    templateUrl: './nodes-tab.component.html',
    styleUrls: ['./nodes-tab.component.scss'],
})
export class NodesTabComponent {
    @Input() nodesCpu: NodeStats[] = [];
    @Input() nodesGpu: NodeStats[] = [];
}
