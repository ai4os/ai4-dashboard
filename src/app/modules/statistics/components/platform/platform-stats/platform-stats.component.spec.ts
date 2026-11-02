jest.mock('ol-mapbox-style', () => ({ applyStyle: jest.fn() }));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { PlatformStatsComponent } from './platform-stats.component';
import { StatsStore } from '@app/modules/statistics/store/stats.store';
import { testProviders } from '@testing/test-providers';

describe('PlatformStatsComponent', () => {
    let component: PlatformStatsComponent;
    let fixture: ComponentFixture<PlatformStatsComponent>;

    beforeEach(async () => {
        TestBed.overrideComponent(PlatformStatsComponent, {
            set: { template: '' },
        });

        await TestBed.configureTestingModule({
            imports: [PlatformStatsComponent],
            providers: [
                ...testProviders,
                {
                    provide: StatsStore,
                    useValue: {
                        cluster: signal({ loading: false, data: null }),
                        user: signal({ loading: false, data: null }),
                        connectCluster: jest
                            .fn()
                            .mockReturnValue(() => undefined),
                        connectUser: jest.fn().mockReturnValue(() => undefined),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PlatformStatsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
