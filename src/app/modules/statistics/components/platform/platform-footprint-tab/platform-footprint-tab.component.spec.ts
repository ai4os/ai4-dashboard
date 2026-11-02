import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlatformFootprintTabComponent } from './platform-footprint-tab.component';
import { testProviders } from '@testing/test-providers';

describe('PlatformFootprintTabComponent', () => {
    let component: PlatformFootprintTabComponent;
    let fixture: ComponentFixture<PlatformFootprintTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlatformFootprintTabComponent],
            providers: [...testProviders],
        }).compileComponents();

        fixture = TestBed.createComponent(PlatformFootprintTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
