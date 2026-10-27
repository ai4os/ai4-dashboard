import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformUsageTabComponent } from './platform-usage-tab.component';

describe('PlatformUsageTabComponent', () => {
    let component: PlatformUsageTabComponent;
    let fixture: ComponentFixture<PlatformUsageTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlatformUsageTabComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PlatformUsageTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
