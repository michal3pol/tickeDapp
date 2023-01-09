import { Pipe, PipeTransform } from '@angular/core';
import { BigNumber, ethers } from 'ethers';

@Pipe({
  name: 'weiToEth'
})
export class WeiToEthPipe implements PipeTransform {

  /**
   * Function converts price in BigNumber to string
   * 
   * @param price - Price in BigNumber
   * @returns Price in string
   *
   */
  transform(price: BigNumber): string {
    return ethers.utils.formatEther(price)
  }

}
