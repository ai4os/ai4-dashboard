import {
    Component,
    Input,
    OnInit,
    ChangeDetectionStrategy,
    inject,
} from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { UserProfile } from '@app/core/services/auth/auth.service';
import { GlobalStats } from '@app/shared/interfaces/stats.interface';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { TimeSeriesChartComponent } from '../../charts/time-series-chart/time-series-chart.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { StatsContainerComponent } from '../../stats-container/stats-container.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-usage-tab',
    templateUrl: './usage-tab.component.html',
    styleUrls: ['./usage-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        MatToolbar,
        MatTabGroup,
        MatTab,
        TimeSeriesChartComponent,
        MatIcon,
        MatTooltip,
        StatsContainerComponent,
        TranslatePipe,
    ],
})
export class UsageTabComponent implements OnInit {
    @Input()
    userProfile!: UserProfile;
    @Input() dates: string[] = [];
    @Input() cpuMhzData: number[] = [];
    @Input() cpuNumData: number[] = [];
    @Input() memoryMBData: number[] = [];
    @Input() diskMBData: number[] = [];
    @Input() gpuNumData: number[] = [];
    @Input() queuedData: number[] = [];
    @Input() runningData: number[] = [];
    @Input() userGlobalStats!: GlobalStats;

    private appConfigService = inject(AppConfigService);

    projectName = '';

    ngOnInit(): void {
        this.projectName = this.appConfigService.projectName;
    }

    getUsername(): string {
        return this.userProfile.name;
    }

    getVO(): string {
        return this.projectName;
    }
}
