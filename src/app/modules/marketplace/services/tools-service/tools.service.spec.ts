import { TestBed } from '@angular/core/testing';

import { ToolsService } from './tools.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppConfigService } from '@app/core/services/app-config/app-config.service';

const mockedConfigService: any = {};

describe('ToolsService', () => {
    let service: ToolsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                { provide: AppConfigService, useValue: mockedConfigService },
            ],
        });
        service = TestBed.inject(ToolsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
