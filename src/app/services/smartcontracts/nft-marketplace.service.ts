import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import { Listing } from 'src/types/marketplace.model';

import nftMarketplace from '../../../../artifacts/contracts/nftMarketplace.sol/nftMarketplace.json'

@Injectable({
  providedIn: 'root'
})
export class NftMarketplaceService {

  constructor() { }


  public async insertOffer(concertAddr: string, tokenId: number, listing: Listing) {
    const contract = await NftMarketplaceService.getContract(true)
    contract['insertOffer'](concertAddr, tokenId, listing)
  }

  private static async getContract(bySigner= false) {
    const provider = new ethers.providers.Web3Provider(<any>window.ethereum)
    const signer = provider.getSigner()

    return new ethers.Contract(
      environment.contractNftMarketplaceAddress,
      nftMarketplace.abi,
      bySigner ? signer : provider
    )
  }

}
