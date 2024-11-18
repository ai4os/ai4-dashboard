import { TestBed } from '@angular/core/testing';

import { SnapshotService } from './snapshot.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';

const mockedConfigService: any = {
    voName: 'vo.ai4eosc.eu',
};

describe('SnapshotService', () => {
    let service: SnapshotService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(SnapshotService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
