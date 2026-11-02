import { TestBed } from '@angular/core/testing';

import { LlmsService } from './llms.service';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';
import { testProviders } from '@testing/test-providers';

describe('LlmsService', () => {
    let service: LlmsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ...testProviders,
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(LlmsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
