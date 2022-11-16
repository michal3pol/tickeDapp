import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BigNumber } from 'ethers';
import { Ticked1155Service } from 'src/app/services/ticked1155.service';

@Component({
  selector: 'app-concert-sectors',
  templateUrl: './concert-sectors.component.html',
  styleUrls: ['./concert-sectors.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConcertSectorsComponent implements OnInit {

  concertAddress!: string;
  sectors: Sector[] = [];
  tickets: Ticket[] = [];
  ticketsMap: Map<number, Ticket> = new Map<number, Ticket>;
  amount = 1;

  constructor(
    private route: ActivatedRoute,
    private ticked1155Service: Ticked1155Service
  ) { }


  async ngOnInit() {
    this.concertAddress = this.route.snapshot.paramMap.get('address')!;
    
    this.sectors = await this.ticked1155Service.getSectors(this.concertAddress);
  }

  async getTickets(index: number) {
    this.ticketsMap.clear();
    for(let tokenId of this.sectors[index].availableTokenIds) {
      this.ticketsMap.set(
        tokenId,
        await this.ticked1155Service.getTicketAttr(this.concertAddress, tokenId)
        )
    }
    console.log(index)
    console.log(this.tickets)
  }

  buyTicket(tokenId: any, price: number, amount = 1) {
    console.log(tokenId.toNumber(), amount)
    let transaction = this.ticked1155Service.buyTicket(
                          this.concertAddress, tokenId.toNumber(), price, amount)
    console.log(transaction)
  }

}
