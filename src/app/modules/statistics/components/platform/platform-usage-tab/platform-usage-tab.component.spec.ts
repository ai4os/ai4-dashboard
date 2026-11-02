import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClusterViewModel } from '@app/shared/models/stats.view-models';

import { PlatformUsageTabComponent } from './platform-usage-tab.component';
import { testProviders } from '@testing/test-providers';

const cluster: ClusterViewModel = {
    updatedAt: '2024-01-01T00:00:00Z',
    jobs: 1,
    resources: {
        cpu: { used: 1, total: 2 },
        memory: { used: 1024, total: 4096, unit: 'MiB' },
        disk: { used: 2048, total: 8192, unit: 'MiB' },
        gpu: { used: 1, total: 2 },
    },
    gpuModels: [{ model: 'test-gpu', used: 1, total: 2 }],
    power: {
        currentW: 42,
        current: { value: 42, unit: 'W' },
        reporting: 1,
        total: 1,
    },
    datacenterEnergy: {},
    datacenters: [],
};

describe('PlatformUsageTabComponent', () => {
    let component: PlatformUsageTabComponent;
    let fixture: ComponentFixture<PlatformUsageTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlatformUsageTabComponent],
            providers: [...testProviders],
        }).compileComponents();

        fixture = TestBed.createComponent(PlatformUsageTabComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('cluster', cluster);
        fixture.detectChanges();
    });

    it('renders the cluster resource summary and GPU detail action', () => {
        expect(fixture.nativeElement.textContent).toContain('42');
        expect(fixture.nativeElement.textContent).toContain('GPU-PER-MODEL');
        expect(component.filteredDates).toEqual([]);
    });
});
