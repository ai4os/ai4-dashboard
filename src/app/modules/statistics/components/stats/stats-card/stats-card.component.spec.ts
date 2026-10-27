import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsCardComponent } from './stats-card.component';

describe('StatsBarCardComponent', () => {
    let component: StatsCardComponent;
    let fixture: ComponentFixture<StatsCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatsCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StatsCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
