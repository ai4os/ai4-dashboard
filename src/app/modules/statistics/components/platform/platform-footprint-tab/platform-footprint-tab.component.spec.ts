import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformFootprintTabComponent } from './platform-footprint-tab.component';

describe('PlatformFootprintTabComponent', () => {
    let component: PlatformFootprintTabComponent;
    let fixture: ComponentFixture<PlatformFootprintTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlatformFootprintTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PlatformFootprintTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
