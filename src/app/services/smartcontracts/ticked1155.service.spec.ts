import { TestBed } from '@angular/core/testing';

import { Ticked1155Service } from './ticked1155.service';

describe('Ticked1155Service', () => {
  let service: Ticked1155Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ticked1155Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
