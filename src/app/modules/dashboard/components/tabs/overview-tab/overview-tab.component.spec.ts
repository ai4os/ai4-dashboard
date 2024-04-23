import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverviewTabComponent } from './overview-tab.component';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalStats } from '@app/shared/interfaces/stats.interface';

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

const mockedUserStats: GlobalStats = {
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
            imports: [TranslateModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(OverviewTabComponent);
        component = fixture.componentInstance;
        component.clusterGlobalStats = mockedClusterStats;
        component.userGlobalStats = mockedUserStats;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show titles and help icons', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        let title = compiled.querySelector('#title-cluster')?.textContent;
        expect(title).toContain('DASHBOARD.CLUSTER');

        title = compiled.querySelector('#title-users')?.textContent;
        expect(title).toContain('DASHBOARD.USERS');

        let helpIcon = compiled.querySelector('#help-cluster');
        expect(helpIcon).toBeTruthy();

        helpIcon = compiled.querySelector('#help-users');
        expect(helpIcon).toBeTruthy();
    });

    it('should cluster and user stats', () => {
        const compiled = fixture.nativeElement as HTMLElement;

        expect(compiled.querySelector('#cluster-stats')).toBeTruthy();
        expect(compiled.querySelector('#user-stats')).toBeTruthy();
    });
});
