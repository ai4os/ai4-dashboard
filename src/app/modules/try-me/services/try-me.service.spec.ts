import { TestBed } from '@angular/core/testing';

import { TryMeService } from './try-me.service';

describe('TryMeService', () => {
  let service: TryMeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TryMeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
