import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BigNumber } from 'ethers';
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
  selectedSector!: Sector;
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

  selectSector(index: number) {
    this.selectedSector = this.sectors[index];
  }

  async showLayout(){
    const _image = await this.ticked1155Service.getImage(this.concertAddress);
    let dialogRef = this.matDialog.open(AudienceLayoutComponent, {
      maxHeight: '80%',
      maxWidth: '80%',
      data: { image: _image }
    });
  }

  // resells
  getResellersOffers() {

  }

}
