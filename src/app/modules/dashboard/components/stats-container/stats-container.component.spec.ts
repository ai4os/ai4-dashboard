import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsContainerComponent } from './stats-container.component';
import { TranslateModule } from '@ngx-translate/core';

describe('StatsContainerComponent', () => {
    let component: StatsContainerComponent;
    let fixture: ComponentFixture<StatsContainerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StatsContainerComponent],
            imports: [TranslateModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(StatsContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
