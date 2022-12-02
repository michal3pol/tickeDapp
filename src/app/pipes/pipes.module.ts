import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeiToEthPipe } from './wei-to-eth.pipe';



@NgModule({
  declarations: [
    WeiToEthPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    WeiToEthPipe
  ]
})
export class PipesModule { }
