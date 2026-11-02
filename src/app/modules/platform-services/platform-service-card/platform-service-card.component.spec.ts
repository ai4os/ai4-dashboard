import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlatformServiceCardComponent } from './platform-service-card.component';
import { testProviders } from '@testing/test-providers';

describe('PlatformServiceCardComponent', () => {
    let component: PlatformServiceCardComponent;
    let fixture: ComponentFixture<PlatformServiceCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlatformServiceCardComponent],
            providers: [...testProviders],
        }).compileComponents();

        fixture = TestBed.createComponent(PlatformServiceCardComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('service', {
            id: 'monitoring',
            name: 'Monitoring service',
            url: 'https://example.test/monitoring',
            desc: 'Service details',
        });
        fixture.componentRef.setInput('colorIndex', 5);
        fixture.detectChanges();
    });

    it('renders the service details and cycles through the accent palette', () => {
        expect(fixture.nativeElement.textContent).toContain(
            'Monitoring service'
        );
        expect(fixture.nativeElement.querySelector('markdown')).not.toBeNull();
        expect(component.service.desc).toBe('Service details');
        expect(component.accentColorVar).toBe('var(--color-secondary-2)');
    });
});
