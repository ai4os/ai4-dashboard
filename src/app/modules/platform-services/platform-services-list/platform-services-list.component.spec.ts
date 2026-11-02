import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlatformServicesListComponent } from './platform-services-list.component';
import { testProviders } from '@testing/test-providers';

describe('PlatformServicesListComponent', () => {
    let component: PlatformServicesListComponent;
    let fixture: ComponentFixture<PlatformServicesListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlatformServicesListComponent],
            providers: [...testProviders],
        }).compileComponents();

        fixture = TestBed.createComponent(PlatformServicesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
