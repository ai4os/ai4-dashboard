import { Component, Input, OnInit } from '@angular/core';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { UserProfile } from '@app/core/services/auth/auth.service';
import { GlobalStats } from '@app/shared/interfaces/stats.interface';

@Component({
    selector: 'app-usage-tab',
    templateUrl: './usage-tab.component.html',
    styleUrls: ['./usage-tab.component.scss'],
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

    constructor(private appConfigService: AppConfigService) {}

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
