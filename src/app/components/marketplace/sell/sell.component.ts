import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TickedFactoryService } from 'src/app/services/ticked-factory.service';
import { Ticked1155Service } from 'src/app/services/ticked1155.service';
import { WalletService } from 'src/app/services/wallet.service';
import { DepConcert } from 'src/types/concert.model';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent implements OnInit {

  constructor(
    private tickedFactoryService: TickedFactoryService,
    private walletService: WalletService,
    private ticked1155Service: Ticked1155Service,
    private router: Router,
  ) { }

  public concerts: DepConcert[] = [];
  public concertOrg: string[] = [];

  async ngOnInit() {
    this.concertOrg = await this.tickedFactoryService.getOrganizers();
    console.log(this.concertOrg)
    for(let org of this.concertOrg) {
      console.log(org)
      this.concerts = await this.tickedFactoryService.getDepContracts(org)
      console.log(this.concerts)
    }
  }

  goToConcert(concertAddress: string) {
    this.router.navigate(['sell', concertAddress]);
  }

}
