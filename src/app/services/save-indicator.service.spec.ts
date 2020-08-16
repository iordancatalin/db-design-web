import { TestBed } from '@angular/core/testing';

import { SaveIndicatorService } from './save-indicator.service';

describe('SaveIndicatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaveIndicatorService = TestBed.get(SaveIndicatorService);
    expect(service).toBeTruthy();
  });
});
