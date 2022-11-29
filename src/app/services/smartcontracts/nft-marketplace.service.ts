import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
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
    contract['withdraw'](this.walletService.getWalletAddress())
  }

  public async buyTicket(concertAddr: string, tokenId: number, listing: Listing) {
    const contract = await NftMarketplaceService.getContract(true)
    contract['buyTicket'](concertAddr, tokenId, listing)
  }

  public async deleteOffer(concertAddr: string, tokenId: number) {
    const contract = await NftMarketplaceService.getContract(true)
    contract['deleteOffer'](concertAddr, tokenId)
  }

  public async updateOffer(concertAddr: string, tokenId: number, listing: Listing) {
    const contract = await NftMarketplaceService.getContract(true)
    contract['updateOffer'](concertAddr, tokenId, listing)
  }

  public async insertOffer(concertAddr: string, tokenId: number, listing: Listing) {
    const contract = await NftMarketplaceService.getContract(true)
    contract['insertOffer'](concertAddr, tokenId, listing)
  }

  public async getSellerIds(concertAddr: number): Promise<string []>{
    const contract = await NftMarketplaceService.getContract()
    return contract['getSellerIds'](concertAddr)
  }
  
  public async getOffersBySeller(sellerAddr: number): Promise<SellerOffer []>{
    const contract = await NftMarketplaceService.getContract()
    return contract['getOffersBySeller'](sellerAddr)
  }

  public async getListedTicket(concertAddr: string, sellerId: string, tokenId: number): Promise<ListedTicket> {
    const contract = await NftMarketplaceService.getContract()
    return contract['getListedTicket'](concertAddr, sellerId, tokenId)
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
