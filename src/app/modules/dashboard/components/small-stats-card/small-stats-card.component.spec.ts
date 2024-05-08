import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallStatsCardComponent } from './small-stats-card.component';
import { TranslateModule } from '@ngx-translate/core';

describe('StatsCardHorizontalComponent', () => {
    let component: SmallStatsCardComponent;
    let fixture: ComponentFixture<SmallStatsCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SmallStatsCardComponent],
            imports: [TranslateModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(SmallStatsCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
