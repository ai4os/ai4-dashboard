import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformServiceCardComponent } from './platform-service-card.component';

describe('PlatformServiceCardComponent', () => {
    let component: PlatformServiceCardComponent;
    let fixture: ComponentFixture<PlatformServiceCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlatformServiceCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PlatformServiceCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
