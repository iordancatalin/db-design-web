import { TestBed } from '@angular/core/testing';

import { FirestoreInterceptorService } from './firestore-interceptor.service';
import { describe, expect } from '@angular/core/testing/src/testing_internal';

describe('FirestoreInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirestoreInterceptorService = TestBed.get(
      FirestoreInterceptorService
    );
    expect(service).toBeTruthy();
  });
});
