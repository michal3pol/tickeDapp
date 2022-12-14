import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import EtherUnitConverter from 'src/app/utils/EtherUnitConverter';

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.scss']
})
export class SectorComponent {

  // toggle for specifying button at the bottom of comp
  @Input() createConcertForm: boolean = false;

  @Output() sectorsEvent = new EventEmitter<string []>();

  form = this.formBuilder.group({
    sectors: this.formBuilder.array([])
  })

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  get sectors() {
    return this.form.controls['sectors'] as FormArray
  }

  /**
   * Function that adds new forms for sectors
   */
  addSector() {
    const sectorForm = this.formBuilder.group({
      sectorName: ['', Validators.required],
      isNumerable:  ['', Validators.required],
      seatStart:  ['1', Validators.required],
      seatStop:  ['', Validators.required],
      mintNow:   ['', Validators.required],
      price:  ['', Validators.required]
    })

    this.sectors.push(sectorForm)
  }

  /**
   * Function that deletes sector from structure
   */
  deleteSector(sectorIndex: number) {
    this.sectors.removeAt(sectorIndex)
  }

  
  /**
   * Function that creates structure of information based on provided data in forms
   */
  confirmSectors() {
    let sectorsArray: string [] =[];
    for(let sector of this.sectors.value){
      sectorsArray.push(sector.sectorName)
      let isNumerableString = sector.isNumerable ? "1" : "0"
      sectorsArray.push(isNumerableString)
      sectorsArray.push(sector.seatStart.toString())
      sectorsArray.push(sector.seatStop.toString())
      if(sector.isNumerable) {
        let mintNowString = sector.mintNow ? "1" : "0"
        sectorsArray.push(mintNowString)
      } else {
        sectorsArray.push("0")
      }
      sectorsArray.push(EtherUnitConverter.etherToWei(sector.price).toString())
    }
    this.sectorsEvent.emit(sectorsArray);
  }

}
