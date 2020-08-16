import { TestBed } from '@angular/core/testing';

import { UserAdditionalInfoService } from './user-additional-info.service';

describe('UserAdditionalInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserAdditionalInfoService = TestBed.get(UserAdditionalInfoService);
    expect(service).toBeTruthy();
  });
});
