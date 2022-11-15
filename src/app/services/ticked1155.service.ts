import { Injectable } from '@angular/core';

import { ethers } from "ethers";
import ticked1155 from '../../../artifacts/contracts/tickeD1155.sol/tickeD1155.json'

@Injectable({
  providedIn: 'root'
})
export class Ticked1155Service {

  constructor() { }


  public async createAndMintTickets(address: string) {
    const contract = await Ticked1155Service.getContract(address, true)

  // TODO 
    const transaction = await contract['createAndMintTickets']()
    const tx = await transaction.wait()

    return tx.status === 1 
  }

  public async addSectors(address: string, sectors: string[]) {
    const contract = await Ticked1155Service.getContract(address, true)
    await contract['addSectors'](sectors)
  }

  public async getSectors(address: string): Promise<Sector[]> {
    const contract = await Ticked1155Service.getContract(address)
    return contract['getSectors']()
  }

  private static async getContract(address: string, bySigner= false) {
    const provider = new ethers.providers.Web3Provider(<any>window.ethereum)
    const signer = provider.getSigner()

    return new ethers.Contract(
      address,
      ticked1155.abi,
      bySigner ? signer : provider
    )
  }
}
