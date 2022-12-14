import { Component, OnInit } from '@angular/core';
import { BigNumber } from 'ethers';
import { NftMarketplaceService } from 'src/app/services/smartcontracts/nft-marketplace.service';
import EtherUnitConverter from 'src/app/utils/EtherUnitConverter';
import { ListedTicket, Listing, SellerOffer } from 'src/types/marketplace.model';

@Component({
  selector: 'app-my-offers',
  templateUrl: './my-offers.component.html',
  styleUrls: ['./my-offers.component.scss']
})
export class MyOffersComponent implements OnInit {

  public balance: BigNumber = BigNumber.from(0);
  private sellerOffers: SellerOffer[] = [];
  // concert address -> offers for this concert
  public sellerTicketsMap: Map<string, ListedTicket[]> = new Map<string, ListedTicket[]>;

  public openUpdateForm = false;
  public amount = 1;
  public price!: number;

  constructor(
    private nftMarketplaceService: NftMarketplaceService
  ) { }

  async ngOnInit() {
    this.balance = await this.nftMarketplaceService.getBalance();
    this.sellerOffers = await this.nftMarketplaceService.getOffersBySeller();

    for(let offer of this.sellerOffers){
      const ticket: ListedTicket = await this.nftMarketplaceService
                            .getListedTicket(offer.concertAddr, offer.sellerId)
      // if someone delete his offer each value in map is set to 0
      if(ticket.listing.seller != "0x0000000000000000000000000000000000000000"){
        if(this.sellerTicketsMap.has(offer.concertAddr)){
          let tickets = this.sellerTicketsMap.get(offer.concertAddr)
          tickets?.push(ticket)
          this.sellerTicketsMap.set(offer.concertAddr, tickets!)
        } else {
          let tickets: ListedTicket[] = [ticket]
          this.sellerTicketsMap.set(offer.concertAddr, tickets)
        }
      }
    }
  }

  /**
   * Function opens form for editing offer 
   * 
   */
  openEditForm() {
    this.openUpdateForm = true;
  }
  
  /**
   * Function updates offer based on input forms
   *
   * @param concertAddr - Address of concert contract 
   * @param currentListing - Current offer 
   * 
   */
  updateOffer(concertAddr: string, currentListing: Listing) {
    const newListing = {
      tokenId: currentListing.tokenId,
      amount: this.amount,
      price: EtherUnitConverter.etherToWei(this.price),
      seller: currentListing.seller
    }
    this.nftMarketplaceService.updateOffer(concertAddr, newListing)
  }

  /**
   * Function deletes offer 
   *
   * @param concertAddr - Address of concert contract 
   * @param tokenId - ID of Token to delete 
   * 
   */
  deleteOffer(concertAddr: string, tokenId: number) {
    this.nftMarketplaceService.deleteOffer(concertAddr, tokenId)
  }

  /**
   * Withdraws money for owner
   *
   */
  async withdraw() {
    const transaction = await this.nftMarketplaceService.withdraw();
    this.balance = BigNumber.from(0);
  }

}
