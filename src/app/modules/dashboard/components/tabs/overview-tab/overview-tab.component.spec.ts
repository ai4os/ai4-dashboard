import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewTabComponent } from './overview-tab.component';
import { TranslateModule } from '@ngx-translate/core';

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
        component.clusterGlobalStats = {
            cpuNumAgg: 14,
            cpuNumTotal: 345,
            memoryMBAgg: 234,
            memoryMBTotal: 234234,
            diskMBAgg: 234,
            diskMBTotal: 2346,
            gpuNumAgg: 12,
            gpuNumTotal: 545,
        };
        component.userGlobalStats = {
            cpuNumAgg: 14,
            cpuNumTotal: 345,
            memoryMBAgg: 234,
            memoryMBTotal: 234234,
            diskMBAgg: 234,
            diskMBTotal: 2346,
            gpuNumAgg: 12,
            gpuNumTotal: 545,
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
