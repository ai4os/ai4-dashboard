import { TestBed } from '@angular/core/testing';

import { SecretsService } from './secrets.service';

describe('SecretsService', () => {
  let service: SecretsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecretsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
