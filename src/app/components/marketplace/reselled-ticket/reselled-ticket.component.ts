import { Component, Input, OnInit } from '@angular/core';
import { NftMarketplaceService } from 'src/app/services/smartcontracts/nft-marketplace.service';
import { ListedTicket } from 'src/types/marketplace.model';

@Component({
  selector: 'app-reselled-ticket',
  templateUrl: './reselled-ticket.component.html',
  styleUrls: ['./reselled-ticket.component.scss']
})
export class ReselledTicketComponent implements OnInit {

  @Input() concertAddress!: string;

  private sellerIds: string[] = []; 
  public listing: ListedTicket[] = [];
  amount = 1;

  constructor(
    private nftMarketplaceService: NftMarketplaceService,
  ) { }

  async ngOnInit() {
    this.sellerIds = await this.nftMarketplaceService.getSellerIds(this.concertAddress);
    
    for(let sellerId of this.sellerIds) {
      const ticket: ListedTicket = await this.nftMarketplaceService
                                          .getListedTicket(this.concertAddress, sellerId)
      // if someone delete his offer it will probably returns undefined                                          
      if(ticket != undefined){
        this.listing.push(ticket);
      }
    }
  }

  buyTicket(){
    // TODO 
  }

  // buyTicket(owner: string, tokenId: number, price: number, amount: number){
  //   this.nftMarketplaceService.buyTicket(
  //                               this.concertAddress,
  //                               owner,
  //                               tokenId)
  // }

}
