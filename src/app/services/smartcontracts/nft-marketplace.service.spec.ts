import { TestBed } from '@angular/core/testing';

import { NftMarketplaceService } from './nft-marketplace.service';

describe('NftMarketplaceService', () => {
  let service: NftMarketplaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NftMarketplaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
