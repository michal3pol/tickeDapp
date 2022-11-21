import { TestBed } from '@angular/core/testing';

import { TickedFactoryService } from './ticked-factory.service';

describe('TickedFactoryService', () => {
  let service: TickedFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TickedFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
