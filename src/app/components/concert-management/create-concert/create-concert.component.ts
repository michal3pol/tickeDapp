import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TickedFactoryService } from 'src/app/services/smartcontracts/ticked-factory.service';
import { Ticked1155Service } from 'src/app/services/smartcontracts/ticked1155.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-create-concert',
  templateUrl: './create-concert.component.html',
  styleUrls: ['./create-concert.component.scss']
})
export class CreateConcertComponent implements OnInit {

  concertSectors: string [] = [];

  commonInf = this.formBuilder.group({
    concertName: ['', Validators.required],
    concertDescription: ['', Validators.required, Validators.minLength(8)],
    concertDate: ['', Validators.required],
    concertSvg: ['', Validators.required],
  })


  constructor(
    private tickedFactoryService: TickedFactoryService,
    private walletService: WalletService,
    private ticked1155Service: Ticked1155Service,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
  }

  public contractsAddress: string[] = [];

  public async createConcert() {
    let stringTime = this.commonInf.get('concertDate')?.getRawValue().toString();
    let unixTimestamp = (new Date(stringTime!)).getTime() / 1000;
    this.tickedFactoryService.createConcertContract(
      this.commonInf.get('concertName')?.getRawValue(),
      this.commonInf.get('concertDescription')?.getRawValue(),
      unixTimestamp,
      this.commonInf.get('concertSvg')?.getRawValue(),
      this.concertSectors
    )
  }

  addSectors(sectors: string[]) {
    this.concertSectors = sectors
  }

}