import { Injectable } from '@angular/core';
import { BigNumber, ethers } from 'ethers';
import { environment } from 'src/environments/environment';
import { ListedTicket, Listing, SellerOffer } from 'src/types/marketplace.model';

import nftMarketplace from '../../../../artifacts/contracts/nftMarketplace.sol/nftMarketplace.json'
import { WalletService } from '../wallet.service';

@Injectable({
  providedIn: 'root'
})
export class NftMarketplaceService {

  constructor(
    private walletService: WalletService,
  ) { }

  public async withdraw(){
    const contract = await NftMarketplaceService.getContract(true)
    try {
      return await contract['withdraw'](this.walletService.getWalletAddress())
    } catch(e: any) {
      console.log(e.error.message )
    }
  }

  public async buyTicket(
    concertAddr: string, 
    owner: string, 
    tokenId: number,
    price: BigNumber,
    amount = 1) {
    const contract = await NftMarketplaceService.getContract(true)
    contract['buyTicket'](concertAddr, owner, tokenId, amount, {
      value: ethers.utils.parseUnits((price.mul(amount)).toString(), "wei")
    })
  }

  public async deleteOffer(concertAddr: string, tokenId: number) {
    const contract = await NftMarketplaceService.getContract(true)
    contract['deleteOffer'](concertAddr, tokenId)
  }

  public async updateOffer(concertAddr: string, listing: Listing) {
    const contract = await NftMarketplaceService.getContract(true)
    contract['updateOffer'](concertAddr, listing)
  }

  public async insertOffer(concertAddr: string, listing: Listing) {
    const contract = await NftMarketplaceService.getContract(true)
    contract['insertOffer'](concertAddr, listing)
  }

  public async getSellerIds(concertAddr: string): Promise<string []>{
    const contract = await NftMarketplaceService.getContract()
    return contract['getSellerIds'](concertAddr)
  }
  
  public async getOffersBySeller(): Promise<SellerOffer []>{
    const contract = await NftMarketplaceService.getContract()
    return contract['getOffersBySeller'](
      await this.walletService.getWalletAddress()
    )
  }

  public async getListedTicket(concertAddr: string, sellerId: string): Promise<ListedTicket> {
    const contract = await NftMarketplaceService.getContract()
    return contract['getListedTicket'](concertAddr, sellerId)
  }

  public async getBalance(): Promise<BigNumber>{
    const contract = await NftMarketplaceService.getContract()
    return contract['balance'](
      await this.walletService.getWalletAddress()
    )
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
