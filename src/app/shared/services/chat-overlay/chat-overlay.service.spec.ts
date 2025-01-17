import { TestBed } from '@angular/core/testing';

import { ChatOverlayService } from './chat-overlay.service';

describe('ChatOverlayService', () => {
  let service: ChatOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatOverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
