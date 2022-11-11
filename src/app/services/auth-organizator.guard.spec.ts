import { TestBed } from '@angular/core/testing';

import { AuthOrganizatorGuard } from './auth-organizator.guard';

describe('AuthOrganizatorGuard', () => {
  let guard: AuthOrganizatorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthOrganizatorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
