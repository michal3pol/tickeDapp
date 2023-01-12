import { Injectable } from '@angular/core';
import { ethers } from "ethers";
import { environment } from 'src/environments/environment';
import { DepConcert } from 'src/types/concert.model';

import tickeDFactory from '../../../../artifacts/contracts/tickeDFactory.sol/tickeDFactory.json'

@Injectable({
  providedIn: 'root'
})
export class TickedFactoryService {

  constructor() { }

  /**
   * Function interacts with smartcontract and fires transaction to authorize offer for address
   *
   * @param address - Address of wallet (granted organizer) 
   * 
   */
  public async authorizeAccess(address: string): Promise<boolean> {
    const contract = await TickedFactoryService.getContract();
    return contract['whitelist'](address);  
  }

  /**
   * Function interacts with smartcontract and fires transaction to create new concert contract
   *
   * @param name - Name of concert
   * @param desc - Description of concert 
   * @param date - Date of concert
   * @param image - Image of audience layout
   * @param sectors - Structure of sectors 
   * @returns Status of transaction
   */
  public async createConcertContract(
    name: string, desc: string, date: Number, image: string, sectors: string[] ){
    
    const contract = await TickedFactoryService.getContract(true)
    const transaction = await contract['createEvent'](
      name, desc, date, image, sectors)
    const tx = await transaction.wait()

    return tx.status === 1
  }

  /**
   * Function interacts with smartcontract and fires transaction to validate owner of factory
   *
   * @param address - Address of wallet 
   * 
   */
  public async validateOwner(address: string): Promise<boolean> {
    const contract = await TickedFactoryService.getContract()
    return address === await contract['owner']()
  }

  /**
   * Function interacts with smartcontract and fires transaction to set organizator permissions
   *
   * @param address - Address of wallet (organizer) 
   * @param toggle - Toggle for specifying permissions (true/false)
   * 
   */
  public async setOrganizatorPermission(address: string, toggle: boolean) {
    const contract = await TickedFactoryService.getContract(true)
    contract['setOrganizatorPermission'](address, toggle)
  }

  public async getOrganizers() {
    const contract = await TickedFactoryService.getContract()
    return contract['getOrganizers']()
  }

  public async getDepContracts(address: string): Promise<DepConcert[]> {
    const contract = await TickedFactoryService.getContract()
    return contract['getDepContracts'](address)
  }

  private static async getContract(bySigner= false) {
    const provider = new ethers.providers.Web3Provider(<any>window.ethereum)
    const signer = provider.getSigner()

    return new ethers.Contract(
      environment.contractTickeDFactoryAddress,
      tickeDFactory.abi,
      bySigner ? signer : provider
    )
  }

}
