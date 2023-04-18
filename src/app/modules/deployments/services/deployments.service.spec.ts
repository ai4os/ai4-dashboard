import { TestBed } from '@angular/core/testing';

import { DeploymentsService } from './deployments.service';

describe('DeploymentsService', () => {
  let service: DeploymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeploymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
