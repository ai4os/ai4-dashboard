import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { NodeStats } from '@app/shared/interfaces/stats.interface';

@Component({
    selector: 'app-nodes-tab',
    templateUrl: './nodes-tab.component.html',
    styleUrls: ['./nodes-tab.component.scss'],
})
export class NodesTabComponent implements OnInit {
    @Input() nodesCpu: NodeStats[] = [];
    @Input() nodesGpu: NodeStats[] = [];

    paginatedNodesCpu: NodeStats[] = [];
    paginatedNodesGpu: NodeStats[] = [];

    lengthCpu = 0;
    lengthGpu = 0;
    pageSize = 5;
    pageIndex = 0;

    pageEvent!: PageEvent;

    ngOnInit(): void {
        this.paginatedNodesCpu = this.nodesCpu.slice(0, this.pageSize);
        this.paginatedNodesGpu = this.nodesGpu.slice(0, this.pageSize);
        this.lengthCpu = this.nodesCpu.length;
        this.lengthGpu = this.nodesGpu.length;
    }

    handleCpuPageEvent(e: PageEvent) {
        this.lengthCpu = this.nodesCpu.length;
        const firstCut = e.pageIndex * e.pageSize;
        const secondCut = firstCut + e.pageSize;
        this.paginatedNodesCpu = this.nodesCpu.slice(firstCut, secondCut);
    }

    handleGpuPageEvent(e: PageEvent) {
        const firstCut = e.pageIndex * e.pageSize;
        const secondCut = firstCut + e.pageSize;
        this.paginatedNodesGpu = this.nodesGpu.slice(firstCut, secondCut);
    }

    getBadgeClass(status: string): string {
        switch (status) {
            case 'ready':
                return 'ready-badge';
            case 'test':
                return 'test-badge';
            case 'error':
                return 'error-badge';
            default:
                return 'default-badge';
        }
    }
}
