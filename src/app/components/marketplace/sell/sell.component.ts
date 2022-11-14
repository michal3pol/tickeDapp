import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TickedFactoryService } from 'src/app/services/ticked-factory.service';
import { Ticked1155Service } from 'src/app/services/ticked1155.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {

  constructor(
    private tickedFactoryService: TickedFactoryService,
    private walletService: WalletService,
    private ticked1155Service: Ticked1155Service,
    private router: Router,
  ) { }

  public concerts: DepConcert[] = [];

  async ngOnInit() {
    // TODO - all concerts not from specific addr
    this.concerts = await this.tickedFactoryService.getDepContracts(
      "0x1cBC2050122E79e5EEd8a5DFFCA5163239a8D61E"
    )
  }

  goToConcert(concertAddress: string) {
    const navigationDetails: string[] = ['/my-concerts'];
    this.router.navigate(navigationDetails);
  }

}
