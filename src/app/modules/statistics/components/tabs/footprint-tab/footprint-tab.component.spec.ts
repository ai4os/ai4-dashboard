import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootprintTabComponent } from './footprint-tab.component';

describe('FootprintTabComponent', () => {
    let component: FootprintTabComponent;
    let fixture: ComponentFixture<FootprintTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FootprintTabComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FootprintTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
