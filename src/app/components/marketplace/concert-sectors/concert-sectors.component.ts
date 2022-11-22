import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Ticked1155Service } from 'src/app/services/smartcontracts/ticked1155.service';
import { Sector, Ticket } from 'src/types/concert.model';
import { AudienceLayoutComponent } from '../audience-layout/audience-layout.component';

@Component({
  selector: 'app-concert-sectors',
  templateUrl: './concert-sectors.component.html',
  styleUrls: ['./concert-sectors.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConcertSectorsComponent implements OnInit {

  concertAddress!: string;
  sectors: Sector[] = [];
  ticketsMap: Map<number, Ticket> = new Map<number, Ticket>;
  amount = 1;

  constructor(
    private route: ActivatedRoute,
    private ticked1155Service: Ticked1155Service,
    private matDialog: MatDialog,
  ) { }


  async ngOnInit() {
    this.concertAddress = this.route.snapshot.paramMap.get('address')!;
    
    this.sectors = await this.ticked1155Service.getSectors(this.concertAddress);
  }

  async getTickets(index: number) {
    this.ticketsMap.clear();
    for(let tokenId of this.sectors[index].availableTokenIds) {
      // because reading from chain is free I think it's better to make more calls
      // than iterate in smartcontract through sectors and available id's 
      // and deleting them when they are sold (we have to pay for code execution)
      const ticket = await this.ticked1155Service.getTicketAttr(this.concertAddress, tokenId);
      if( !ticket.sold ) {
        this.ticketsMap.set(tokenId, ticket)
      }
    }
  }

  buyTicket(tokenId: any, price: number, amount = 1) {
    this.ticked1155Service.buyTicket(
      this.concertAddress, tokenId.toNumber(), price, amount)
  }

  async showLayout(){
    let _image = await this.ticked1155Service.getImage(this.concertAddress);
    let dialogRef = this.matDialog.open(AudienceLayoutComponent, {
      maxHeight: '80%',
      maxWidth: '80%',
      data: { image: _image }
    });
  }

}
