import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformServicesListComponent } from './platform-services-list.component';

describe('PlatformServicesListComponent', () => {
    let component: PlatformServicesListComponent;
    let fixture: ComponentFixture<PlatformServicesListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlatformServicesListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PlatformServicesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
