import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupportListComponent } from './support-list.component';
import { testProviders } from '@testing/test-providers';

describe('SupportListComponent', () => {
    let component: SupportListComponent;
    let fixture: ComponentFixture<SupportListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SupportListComponent],
            providers: [...testProviders],
        }).compileComponents();

        fixture = TestBed.createComponent(SupportListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
