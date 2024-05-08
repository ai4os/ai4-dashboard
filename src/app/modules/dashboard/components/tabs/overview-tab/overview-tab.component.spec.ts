import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverviewTabComponent } from './overview-tab.component';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalStats } from '@app/shared/interfaces/stats.interface';
import { expect } from '@jest/globals';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';

const mockedConfigService: any = {};

const mockedClusterStats: GlobalStats = {
    cpuNumAgg: 14,
    cpuNumTotal: 345,
    memoryMBAgg: 234,
    memoryMBTotal: 234234,
    diskMBAgg: 234,
    diskMBTotal: 2346,
    gpuNumAgg: 12,
    gpuNumTotal: 545,
};

describe('OverviewTabComponent', () => {
    let component: OverviewTabComponent;
    let fixture: ComponentFixture<OverviewTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OverviewTabComponent],
            imports: [TranslateModule.forRoot(), HttpClientTestingModule],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(OverviewTabComponent);
        component = fixture.componentInstance;
        component.clusterGlobalStats = mockedClusterStats;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('should show titles and help icons', () => {
    //     const compiled = fixture.nativeElement as HTMLElement;

    //     const title = compiled.querySelector('#title-cluster')?.textContent;
    //     expect(title).toContain('DASHBOARD.CLUSTER');

    //     const helpIcon = compiled.querySelector('#help-cluster');
    //     expect(helpIcon).toBeTruthy();
    // });

    // it('should cluster and user stats', () => {
    //     const compiled = fixture.nativeElement as HTMLElement;

    //     expect(compiled.querySelector('#cluster-stats')).toBeTruthy();
    // });
});
