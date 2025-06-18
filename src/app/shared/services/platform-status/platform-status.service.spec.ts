import { TestBed } from '@angular/core/testing';
import { PlatformStatusService } from './platform-status.service';
import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
    PlatformStatus,
    StatusNotification,
} from '@app/shared/interfaces/platform-status.interface';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { mockedPlatformStatusNotifications } from '@app/shared/services/platform-status/platform-status.service.mock';

describe('PlatformStatusService', () => {
    let service: PlatformStatusService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(PlatformStatusService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get dashboard popup issues with specific labels', () => {
        service.getPlatformPopup().subscribe((result) => {
            expect(result.length).toBe(2);
        });

        const req = httpMock.expectOne((req) =>
            req.url.includes(
                'https://api.github.com/repos/AI4EOSC/status/issues'
            )
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockedPlatformStatusNotifications);
    });

    it('should get dashboard notification issues with specific labels', () => {
        service.getPlatformNotifications().subscribe((result) => {
            expect(result.length).toBe(2);
        });

        const req = httpMock.expectOne((req) =>
            req.url.includes(
                'https://api.github.com/repos/AI4EOSC/status/issues'
            )
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockedPlatformStatusNotifications);
    });

    it('should get only nomad cluster issues', () => {
        const mockIssues: PlatformStatus[] = [
            { labels: [{ name: 'nomad-maintenance' }] },
        ] as any;

        service.getNomadClusterNotifications().subscribe((result) => {
            expect(result).toEqual(mockIssues);
        });

        const req = httpMock.expectOne((req) =>
            req.url.includes('&labels=nomad-maintenance')
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockIssues);
    });

    it('should filter by date and vo', () => {
        const now = new Date();
        const validNotification: StatusNotification = {
            vo: 'vo.ai4eosc.eu',
            start: new Date(now.getTime() - 10000),
            end: new Date(now.getTime() + 10000),
        } as any;

        const expiredNotification: StatusNotification = {
            vo: 'vo.ai4eosc.eu',
            start: new Date(now.getTime() - 20000),
            end: new Date(now.getTime() - 10000),
        } as any;

        const wrongVo: StatusNotification = {
            vo: 'vo.test.eu',
            start: new Date(now.getTime() - 10000),
            end: new Date(now.getTime() + 10000),
        } as any;

        const alwaysVisible: StatusNotification = {
            vo: null,
        } as any;

        const filtered = service.filterByDateAndVo([
            validNotification,
            expiredNotification,
            wrongVo,
            alwaysVisible,
        ]);

        expect(filtered).toContain(validNotification);
        expect(filtered).toContain(alwaysVisible);
        expect(filtered).not.toContain(expiredNotification);
        expect(filtered).not.toContain(wrongVo);
    });

    it('should return translated maintenance info string', () => {
        const notification: StatusNotification = {
            datacenters: 'DC-1',
            downtimeStart: new Date('2024-01-01'),
            downtimeEnd: new Date('2024-01-02'),
        } as any;

        const translateService = TestBed.inject(TranslateService);
        const spy = jest
            .spyOn(translateService, 'instant')
            .mockReturnValue('translated-text');

        const result = service.getMaintenanceInfo(notification);

        expect(spy).toHaveBeenCalledWith(
            'DEPLOYMENTS.DATACENTER-DOWNTIME-DESC',
            {
                datacenters: 'DC-1',
                startDate: '1/1/2024',
                endDate: '2/1/2024',
            }
        );
        expect(result).toContain('translated-text');
    });
});
