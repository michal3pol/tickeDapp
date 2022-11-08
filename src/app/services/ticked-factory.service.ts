import { Injectable } from '@angular/core';
import { ethers } from "ethers";
import { environment } from 'src/environments/environment';

import tickeDFactory from '../../../artifacts/contracts/tickeDFactory.sol/tickeDFactory.json'

@Injectable({
  providedIn: 'root'
})
export class TickedFactoryService {

  constructor() { }

  public async getDepContracts(address: string): Promise<any[]> {
    const contract = await TickedFactoryService.getContract()
    return contract['getDepContracts'](address)
  }

  public async authorizeAccess(address: string): Promise<boolean> {
    const contract = await TickedFactoryService.getContract();
    return contract['whitelist'](address);
  }

  public async createConcertContract(
    name: string, desc: string, date: Number, sectors: string[] ){
    
    const contract = await TickedFactoryService.getContract(true)
    const transaction = await contract['createTickets'](
      name, desc, date, sectors)
    const tx = await transaction.wait()

    return tx.status === 1
  }

  private static async getContract(bySigner= false) {
    const provider = new ethers.providers.Web3Provider(<any>window.ethereum)
    const signer = provider.getSigner()

    return new ethers.Contract(
      environment.contractAddress,
      tickeDFactory.abi,
      bySigner ? signer : provider
    )

  }

}
