import { TestBed } from '@angular/core/testing';

import { ModulesService } from './modules.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';

const mockedConfigService: any = {};

describe('ModulesService', () => {
    let service: ModulesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(ModulesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
