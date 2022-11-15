import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ticked1155Service } from 'src/app/services/ticked1155.service';

@Component({
  selector: 'app-concert-sectors',
  templateUrl: './concert-sectors.component.html',
  styleUrls: ['./concert-sectors.component.scss']
})
export class ConcertSectorsComponent implements OnInit {

  concertAddress!: string;
  sectors: Sector[] = [];

  constructor(
    private route: ActivatedRoute,
    private ticked1155Service: Ticked1155Service
  ) { }


  async ngOnInit() {
    this.concertAddress = this.route.snapshot.paramMap.get('address')!;
    
    this.sectors = await this.ticked1155Service.getSectors(this.concertAddress);

  }

}
