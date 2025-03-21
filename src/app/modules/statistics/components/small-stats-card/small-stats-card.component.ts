import { Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-small-stats-card',
    templateUrl: './small-stats-card.component.html',
    styleUrls: ['./small-stats-card.component.scss'],
})
export class SmallStatsCardComponent implements OnChanges {
    @Input() title = '';
    @Input() used_value = 0;
    @Input() total_value = 0;
    @Input() icon_name = '';
    @Input() memory_unit?: string;

    constructor(public translateService: TranslateService) {}

    stat_value = '';

    getUnit(): string {
        let unit = '';
        if (this.memory_unit) {
            unit = this.memory_unit;
        }
        return unit;
    }

    ngOnChanges(): void {
        this.stat_value =
            this.translateService.instant('DASHBOARD.STATS-TITLES.USED') +
            ' ' +
            this.used_value +
            ' ' +
            this.translateService.instant('DASHBOARD.STATS-TITLES.OF') +
            ' ' +
            this.total_value;
        if (this.memory_unit) {
            this.stat_value = this.stat_value + ' ' + this.memory_unit;
        }
    }
}
