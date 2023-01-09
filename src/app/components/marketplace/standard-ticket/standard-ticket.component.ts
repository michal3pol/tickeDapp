import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BigNumber } from 'ethers';
import { Ticked1155Service } from 'src/app/services/smartcontracts/ticked1155.service';
import { Sector, Ticket } from 'src/types/concert.model';

@Component({
  selector: 'app-standard-ticket',
  templateUrl: './standard-ticket.component.html',
  styleUrls: ['./standard-ticket.component.scss']
})
export class StandardTicketComponent implements OnChanges {

  @Input() concertAddress!: string;
  @Input() sector!: Sector;
  // map - ticketId -> tickerAttr
  ticketsMap: Map<number, Ticket> = new Map<number, Ticket>;
  amount = 1;

  constructor(
    private ticked1155Service: Ticked1155Service,
  ) { }
  
  async ngOnChanges(changes: SimpleChanges) {
    if(changes['sector'].currentValue == undefined || 
              this.concertAddress == undefined ){
      return
    }

    this.ticketsMap.clear();
    const availableTickets: number[] = this.validateAvailability(
      changes['sector'].currentValue.availableTokenIds, 
      await this.ticked1155Service.getSectorSoldIds(
        this.concertAddress, changes['sector'].currentValue.name)
      );

    for(let tokenId of availableTickets) {
      // DEPRECATED APPROACH: because reading from chain is free I think it's better to make more calls than iterate 
      // in smartcontract through sectors and available id's and deleting them when they are sold (we have to pay for code execution)
      // NEW APPROACH: store sold tickets ids in smartcontract map then use validateAvailability
      const ticket = await this.ticked1155Service.getTicketAttr(this.concertAddress, tokenId);
      this.ticketsMap.set(tokenId, ticket)
    }
  }

  validateAvailability(allTickets: BigNumber[], soldTickets: BigNumber[]): number[] {
      let resultArray: number[] = [];
      for(let ticketId of allTickets){
        // if soldTickets does not contain ticketId -> push
        if( !soldTickets.some(id => id.toNumber() == ticketId.toNumber())) {
          resultArray.push(ticketId.toNumber());
        }
      }
      return resultArray;
  }

  /**
   * Function that fires transaction for buying ticket 
   *
   * @param tokenId - Token ID 
   * @param price - Token price
   * @param amount - Amount of tokens to buy (by default sets to 1)
   * 
   */
  buyTicket(tokenId: number, price: BigNumber, amount = 1) {
    this.ticked1155Service.buyTicket(
      this.concertAddress, tokenId, price, amount)
  }

}
