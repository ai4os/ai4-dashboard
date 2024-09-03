import { TestBed } from '@angular/core/testing';

import { SnackbarService } from './snackbar.service';
import { SharedModule } from '@app/shared/shared.module';

describe('SnackbarService', () => {
    let service: SnackbarService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [SharedModule],
        });
        service = TestBed.inject(SnackbarService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
