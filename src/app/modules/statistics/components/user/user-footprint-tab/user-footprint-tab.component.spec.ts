import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserFootprintTabComponent } from './user-footprint-tab.component';
import { testProviders } from '@testing/test-providers';

describe('UserFootprintTabComponent', () => {
    let component: UserFootprintTabComponent;
    let fixture: ComponentFixture<UserFootprintTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserFootprintTabComponent],
            providers: [...testProviders],
        }).compileComponents();

        fixture = TestBed.createComponent(UserFootprintTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
