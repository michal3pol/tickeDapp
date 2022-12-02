import { Pipe, PipeTransform } from '@angular/core';
import { BigNumber, ethers } from 'ethers';

@Pipe({
  name: 'weiToEth'
})
export class WeiToEthPipe implements PipeTransform {

  transform(price: BigNumber): string {
    return ethers.utils.formatEther(price)
    //return EtherUnitConverter.weiToEther(price).toString();
  }

}
