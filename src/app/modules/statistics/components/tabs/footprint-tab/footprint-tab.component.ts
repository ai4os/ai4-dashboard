import { Component, Input, OnInit } from '@angular/core';
import { DatacenterStats } from '@app/shared/interfaces/stats.interface';

@Component({
    selector: 'app-footprint-tab',
    templateUrl: './footprint-tab.component.html',
    styleUrl: './footprint-tab.component.scss',
})
export class FootprintTabComponent implements OnInit {
    @Input() datacentersStats: DatacenterStats[] = [];

    protected datacenterNames: string[] = [];
    protected datacenterCountries: string[] = [];
    protected affinityValues: number[] = [];

    protected carbonTimestamps: string[] = [];
    protected carbonValues: number[][] = [];

    protected waterTimestamps: string[] = [];
    protected waterValues: number[][] = [];

    ngOnInit(): void {
        this.datacenterNames = this.datacentersStats.map((dc) => dc.name);
        this.datacenterCountries = this.datacentersStats.map(
            (dc) => dc.country
        );
        this.affinityValues = this.datacentersStats.map((dc) => dc.affinity);

        this.carbonTimestamps =
            this.datacentersStats[0]?.footprints.carbon.map((f) => {
                const date = new Date(f[0]);
                return date.toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'UTC',
                });
            }) || [];

        this.carbonValues = this.datacentersStats.map((dc) =>
            dc.footprints.carbon.map((f) => f[1])
        );

        this.waterTimestamps =
            this.datacentersStats[0]?.footprints.water.map((f) => {
                const date = new Date(f[0]);
                return date.toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'UTC',
                });
            }) || [];

        this.waterValues = this.datacentersStats.map((dc) =>
            dc.footprints.water.map((f) => f[1])
        );
    }
}
