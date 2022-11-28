import { Pipe, PipeTransform } from '@angular/core';
import EtherUnitConverter from '../utils/EtherUnitConverter';

@Pipe({
  name: 'weiToEth'
})
export class WeiToEthPipe implements PipeTransform {

  transform(price: number): number {
    return EtherUnitConverter.weiToEther(price);
  }

}
