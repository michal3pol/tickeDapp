import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeiToEthPipe } from './wei-to-eth.pipe';
import { FilterConcertsPipe } from './filter-concerts.pipe';



@NgModule({
  declarations: [
    WeiToEthPipe,
    FilterConcertsPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    WeiToEthPipe,
    FilterConcertsPipe
  ]
})
export class PipesModule { }
