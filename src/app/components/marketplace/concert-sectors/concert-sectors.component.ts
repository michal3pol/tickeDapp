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
  concertName: string = '';
  concertDescription: string = '';
  concertDate!: number;

  selectedSector!: Sector;
  ticketsMap: Map<number, Ticket> = new Map<number, Ticket>;
  amount = 1;
  selectedStandardTickets: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private ticked1155Service: Ticked1155Service,
    private matDialog: MatDialog,
  ) { }


  async ngOnInit() {
    this.concertAddress = this.route.snapshot.paramMap.get('address')!;
    
    this.sectors = await this.ticked1155Service.getSectors(this.concertAddress);
    this.concertName = await this.ticked1155Service.getName(this.concertAddress);
    this.concertDescription = await this.ticked1155Service.getDescription(this.concertAddress);
    this.concertDate = await this.ticked1155Service.getDate(this.concertAddress);
  }

  /**
   * Function that changes currently chosen sector 
   * 
   * @param index - Index of sector 
   */
  selectSector(index: number) {
    this.selectedStandardTickets = true;
    this.selectedSector = this.sectors[index];
  }

  /**
   * Function that shows dialog with layout  
   */
  async showLayout(){
    const _image = await this.ticked1155Service.getImage(this.concertAddress);
    let dialogRef = this.matDialog.open(AudienceLayoutComponent, {
      maxHeight: '80%',
      maxWidth: '80%',
      data: { image: _image }
    });
  }

  // resells
  /**
   * Function that toggles for resellers offers  
   */
  resellersOffers() {
    this.selectedStandardTickets = false;
  }

}
