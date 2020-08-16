import { TestBed } from '@angular/core/testing';

import { AuthChildGuardService } from './auth-child-guard.service';

describe('AuthChildGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthChildGuardService = TestBed.get(AuthChildGuardService);
    expect(service).toBeTruthy();
  });
});
