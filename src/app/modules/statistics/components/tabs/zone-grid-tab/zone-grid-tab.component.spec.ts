import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneGridTabComponent } from './zone-grid-tab.component';

describe('ZoneGridTabComponent', () => {
    let component: ZoneGridTabComponent;
    let fixture: ComponentFixture<ZoneGridTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ZoneGridTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ZoneGridTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
