import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TickedFactoryService } from 'src/app/services/ticked-factory.service';
import { Ticked1155Service } from 'src/app/services/ticked1155.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-create-concert',
  templateUrl: './create-concert.component.html',
  styleUrls: ['./create-concert.component.css']
})
export class CreateConcertComponent implements OnInit {

  // this probably should be moved to other comp
  concertName = new FormControl('');
  concertDescription = new FormControl('');
  concertDate = new FormControl('');
  concertSectors = new FormControl('');

  constructor(
    private tickedFactoryService: TickedFactoryService,
    private walletService: WalletService,
    private ticked1155Service: Ticked1155Service,
  ) { }

  ngOnInit(): void {
  }

  public contractsAddress: string[] = [];

  public async getDepContracts(){
    this.contractsAddress = await this.tickedFactoryService.getDepContracts(
      await this.walletService.getWalletAddress() )
    console.log(this.contractsAddress)
  }

  public async createConcert() {
    let stringTime = this.concertDate.getRawValue()?.toString();
    let unixTimestamp = (new Date(stringTime!)).getTime() / 1000;
    let splittedSectors = this.concertSectors.getRawValue()?.split(",");

    this.tickedFactoryService.createConcertContract(
      this.concertName.getRawValue()!,
      this.concertDescription.getRawValue()!,
      unixTimestamp,
      splittedSectors!
    )
  }

  // TODO somehow manage address
  public async mintTickets() {
    this.ticked1155Service.mintTickets("0x66716BeBba93c9A0223F47E9E87b3554Bc891d0d");
  }

}