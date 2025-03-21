import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallStatsCardComponent } from './small-stats-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { SharedModule } from '@app/shared/shared.module';

describe('StatsCardHorizontalComponent', () => {
    let component: SmallStatsCardComponent;
    let fixture: ComponentFixture<SmallStatsCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SmallStatsCardComponent],
            imports: [TranslateModule.forRoot(), SharedModule],
        }).compileComponents();

        fixture = TestBed.createComponent(SmallStatsCardComponent);
        component = fixture.componentInstance;
        component.title = 'CPUs';
        component.used_value = 10;
        component.total_value = 20;
        component.icon_name = 'memory';
        component.ngOnChanges();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show resource', () => {
        const titleElement = fixture.debugElement.query(By.css('.title'));
        const titleValue = titleElement.nativeElement.textContent;
        expect(titleValue).toEqual('CPUs');

        const iconElement = fixture.debugElement.query(By.css('.icon'));
        const iconValue = iconElement.nativeElement.textContent;
        expect(iconValue).toEqual('memory');

        const descElement = fixture.debugElement.query(By.css('.value'));
        const descValue = descElement.nativeElement.textContent;
        expect(descValue).toEqual(
            'DASHBOARD.STATS-TITLES.USED 10 DASHBOARD.STATS-TITLES.OF 20'
        );
    });
});
