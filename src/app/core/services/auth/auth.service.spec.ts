import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { MatDialogMock } from '@app/test/mocks/mat-dialog.mock';
import { MsalServiceMock } from '@app/test/mocks/msal.service.mock';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        MsalServiceMock.getProvider(),
        MatDialogMock.getProvider(),
      ],
      imports: [HttpClientTestingModule, RouterTestingModule],
    });

    service = TestBed.inject(AuthService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
