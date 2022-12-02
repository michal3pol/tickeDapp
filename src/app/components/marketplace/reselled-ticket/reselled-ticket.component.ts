import { Component, Input, OnInit } from '@angular/core';
import { BigNumber } from 'ethers';
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
      // if someone delete his offer each value in map is set to 0
      if(ticket.listing.seller != "0x0000000000000000000000000000000000000000"){
        this.listing.push(ticket);
      }
    }
  }

  buyTicket(owner: string, tokenId: number, price: BigNumber){
    this.nftMarketplaceService.buyTicket(
                                this.concertAddress,
                                owner,
                                tokenId,
                                price,
                                this.amount)
  }


}
