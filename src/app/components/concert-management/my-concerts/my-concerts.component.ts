import { Component, OnInit } from '@angular/core';
import { TickedFactoryService } from 'src/app/services/smartcontracts/ticked-factory.service';
import { Ticked1155Service } from 'src/app/services/smartcontracts/ticked1155.service';
import { WalletService } from 'src/app/services/wallet.service';
import { DepConcert } from 'src/types/concert.model';

@Component({
  selector: 'app-my-concerts',
  templateUrl: './my-concerts.component.html',
  styleUrls: ['./my-concerts.component.scss']
})
export class MyConcertsComponent implements OnInit {

  constructor(
    private tickedFactoryService: TickedFactoryService,
    private walletService: WalletService,
    private ticked1155Service: Ticked1155Service,
  ) { }

  public deployedConcerts: DepConcert[] = [];

  async ngOnInit() {
    this.deployedConcerts = await this.tickedFactoryService.getDepContracts(
      await this.walletService.getWalletAddress() )
  }

  public async mintTickets(contractAddress: string) {
    this.ticked1155Service.createAndMintTickets(contractAddress)
  }

  addSectors(sectors: string[], address: string) {
    this.ticked1155Service.addSectors(address, sectors)
  }

}
