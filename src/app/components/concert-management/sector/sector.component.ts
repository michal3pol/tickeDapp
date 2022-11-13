import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.css']
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

  deleteSector(sectorIndex: number) {
    this.sectors.removeAt(sectorIndex)
  }

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
      sectorsArray.push(sector.price.toString())
    }
    console.log(sectorsArray);
    this.sectorsEvent.emit(sectorsArray);
  }

}
