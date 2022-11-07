import { Injectable } from '@angular/core';
import { ethers } from "ethers";
import { getContractAddress } from 'ethers/lib/utils.js';
import { environment } from 'src/environments/environment';

import tickeDFactory from '../../../artifacts/contracts/tickeDFactory.sol/tickeDFactory.json'

@Injectable({
  providedIn: 'root'
})
export class TickedFactoryService {

  constructor() { }

  public async getDepContracts(address: string): Promise<any[]> {
    address = "0x1cBC2050122E79e5EEd8a5DFFCA5163239a8D61E"; //tmp

    const contract = await TickedFactoryService.getContract();

    return contract['getDepContracts'](address);

  }

  private static async getContract() {
    const provider = new ethers.providers.Web3Provider(<any>window.ethereum);
    const signer = provider.getSigner();

    return new ethers.Contract(
      environment.contractAddress,
      tickeDFactory.abi,
      provider
    )

  }

}
