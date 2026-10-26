import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsBarCardComponent } from './stats-bar-card.component';

describe('StatsBarCardComponent', () => {
    let component: StatsBarCardComponent;
    let fixture: ComponentFixture<StatsBarCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatsBarCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(StatsBarCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
