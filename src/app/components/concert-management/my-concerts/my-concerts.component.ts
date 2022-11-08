import { Component, OnInit } from '@angular/core';
import { TickedFactoryService } from 'src/app/services/ticked-factory.service';
import { Ticked1155Service } from 'src/app/services/ticked1155.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-my-concerts',
  templateUrl: './my-concerts.component.html',
  styleUrls: ['./my-concerts.component.css']
})
export class MyConcertsComponent implements OnInit {

  constructor(
    private tickedFactoryService: TickedFactoryService,
    private walletService: WalletService,
    private ticked1155Service: Ticked1155Service,
  ) { }

  public contractsAddress: string[] = [];

  async ngOnInit() {
    this.contractsAddress = await this.tickedFactoryService.getDepContracts(
      await this.walletService.getWalletAddress() )
    console.log(this.contractsAddress)
  }

}
