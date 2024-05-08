import { TestBed } from '@angular/core/testing';

import { SecretsService } from './secrets.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';

const mockedConfigService: any = {};

describe('SecretsService', () => {
    let service: SecretsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(SecretsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
