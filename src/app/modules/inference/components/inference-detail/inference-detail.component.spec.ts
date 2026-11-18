import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { testProviders } from '@testing/test-providers';
import { of, throwError } from 'rxjs';
import { OscarInferenceService } from '../../services/oscar-inference.service';
import {
    mockedOscarInferenceService,
    mockedOscarServices,
} from '../../services/oscar-inference.service.mock';
import { InferenceDetailComponent } from './inference-detail.component';

describe('InferenceDetailComponent', () => {
    let component: InferenceDetailComponent;
    let fixture: ComponentFixture<InferenceDetailComponent>;
    let uuid: string;
    let router: { navigate: jest.Mock };

    beforeEach(async () => {
        uuid = 'test-service';
        mockedOscarInferenceService.getServiceByName
            .mockReset()
            .mockReturnValue(of({ ...mockedOscarServices[0] }));
        router = { navigate: jest.fn() };

        TestBed.overrideComponent(InferenceDetailComponent, {
            set: { template: '' },
        });

        await TestBed.configureTestingModule({
            imports: [InferenceDetailComponent],
            providers: [
                ...testProviders,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: (name: string) =>
                                    name === 'uuid' ? uuid : null,
                            },
                        },
                    },
                },
                { provide: Router, useValue: router },
                {
                    provide: OscarInferenceService,
                    useValue: mockedOscarInferenceService,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(InferenceDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create and load the service identified by the route', () => {
        expect(component).toBeTruthy();
        expect(
            mockedOscarInferenceService.getServiceByName
        ).toHaveBeenCalledWith('test-service');
        expect(component.uuid).toBe('test-service');
        expect(component.service?.title).toBe('Oscar Service Mock Title');
        expect(component.service?.description).toBe('Mock Description');
        expect(component.service?.submit_time).toBe('2023-01-01T00:00:00Z');
        expect(component.endpointField).toBe('https://minio.example.test');
        expect(component.accessKeyField).toBe('mock-access-key');
        expect(component.minioSecretField).toBe('mock-secret-key');
        expect(component.isLoading).toBe(false);
    });

    it('should clear the loading state when loading the service fails', () => {
        mockedOscarInferenceService.getServiceByName.mockReturnValue(
            throwError(() => new Error('Error'))
        );
        component.isLoading = false;

        component.getService();

        expect(
            mockedOscarInferenceService.getServiceByName
        ).toHaveBeenLastCalledWith('test-service');
        expect(component.isLoading).toBe(false);
    });

    it('should format resource values in CPU and memory order', () => {
        expect(component.resourceItems).toEqual([
            {
                label: 'INFERENCE.DETAIL.RESOURCES.CPU',
                value: '2',
                unit: '',
                icon: 'memory',
                color: 'var(--color-accent)',
            },
            {
                label: 'INFERENCE.DETAIL.RESOURCES.MEMORY',
                value: '1024',
                unit: 'MiB',
                icon: 'memory_alt',
                color: 'var(--color-secondary-4)',
            },
        ]);
    });

    it('should update the active tab and navigate with the tab query param', () => {
        component.onTabChange('calls');

        expect(component.activeTabId).toBe('calls');
        expect(router.navigate).toHaveBeenCalledWith([], {
            relativeTo: expect.anything(),
            queryParams: { tab: 'calls' },
            queryParamsHandling: 'merge',
            replaceUrl: true,
        });
    });
});
