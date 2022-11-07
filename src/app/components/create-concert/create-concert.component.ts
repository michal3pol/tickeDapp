import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TickedFactoryService } from 'src/app/services/ticked-factory.service';
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
    console.log(this.concertName.getRawValue(), this.concertDescription.getRawValue(), 
      this.concertDate.getRawValue(), this.concertSectors.getRawValue());

    let stringTime = this.concertDate.getRawValue()?.toString();
    console.log("FUA" + stringTime)
    let unixTimestamp = (new Date(stringTime!)).getTime() / 1000;
    console.log("FIFARAFA" + unixTimestamp);
    let splittedSectors = this.concertSectors.getRawValue()?.split(",");
    console.log(splittedSectors);

    this.tickedFactoryService.createConcertContract(
      this.concertName.getRawValue()!,
      this.concertDescription.getRawValue()!,
      unixTimestamp,
      splittedSectors!
    )

  }

}