import { TestBed } from '@angular/core/testing';

import { LlmsService } from './llms.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { mockedConfigService } from '@app/core/services/app-config/app-config.mock';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';

describe('LlmsService', () => {
    let service: LlmsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(LlmsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
