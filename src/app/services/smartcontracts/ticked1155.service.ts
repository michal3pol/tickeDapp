import { Injectable } from '@angular/core';

import { BigNumber, ethers } from "ethers";
import { Sector, Ticket } from 'src/types/concert.model';
import ticked1155 from '../../../../artifacts/contracts/tickeD1155.sol/tickeD1155.json'
import { WalletService } from '../wallet.service';

@Injectable({
  providedIn: 'root'
})
export class Ticked1155Service {

  constructor(
    private walletService: WalletService,
  ) { }


  /**
   * Function interacts with smartcontract and fires transaction to create and mint tokens
   *
   * @param address - Address of concert contract 
   * @returns Status of transaction
   * 
   */
  public async createAndMintTickets(address: string) {
    const contract = await Ticked1155Service.getContract(address, true)

    const transaction = await contract['createAndMintTickets']()
    const tx = await transaction.wait()

    return tx.status === 1 
  }

  /**
   * Function interacts with smartcontract and fires transaction to add sectors structure
   *
   * @param address - Address of concert contract 
   * @param sectors - Structure of sectors 
   * 
   */  
  public async addSectors(address: string, sectors: string[]) {
    const contract = await Ticked1155Service.getContract(address, true)
    await contract['addSectors'](sectors)
  }

  /**
   * Function interacts with smartcontract and fires transaction to buy ticket
   *
   * @param address - Address of concert contract 
   * @param tokenId - ID of token to buy 
   * @param price - ID of token to buy 
   * @param amount - amount of tokens to buy (by default = 1)
   * 
   */
  public async buyTicket(address: string, tokenId: number, price: BigNumber, amount = 1) {
    const contract = await Ticked1155Service.getContract(address, true)
    const transaction = await contract['buyTicket'](tokenId, amount, {
      value: ethers.utils.parseUnits((price.mul(amount)).toString(), "wei")
    })
    const tx = await transaction.wait();

    return tx.status === 1
  }

  /**
   * Withdraws money for currently logged wallet
   * 
   */
  public async withdraw(address: string){
    const contract = await Ticked1155Service.getContract(address, true)
    try {
      return await contract['withdrawOrgCredits'](this.walletService.getWalletAddress())
    } catch(e: any) {
      console.log(e.error.message )
    }
  }

  /**
   * Function interacts with smartcontract and fires transaction to check approval of tokens
   *
   * @param address - Address of concert contract 
   * @param account - Owner of tokens
   * @param operator - Address to check 
   * @returns State of approval
   * 
   */
  public async isApprovedForAll(address: string, account: string, operator: string): Promise<boolean>{
    const contract = await Ticked1155Service.getContract(address)
    return contract['isApprovedForAll'](account, operator)
  }

  public async getImage(address: string): Promise<string>{
    const contract = await Ticked1155Service.getContract(address)
    return contract['image']()
  }

  public async getName(address: string): Promise<string> {
    const contract = await Ticked1155Service.getContract(address)
    return contract['name']()
  }

  public async getDescription(address: string): Promise<string> {
    const contract = await Ticked1155Service.getContract(address)
    return contract['description']()
  }

  public async getDate(address: string): Promise<number> {
    const contract = await Ticked1155Service.getContract(address)
    return contract['date']()
  }

  public async getSectors(address: string): Promise<Sector[]> {
    const contract = await Ticked1155Service.getContract(address)
    return contract['getSectors']()
  }

  public async getSectorSoldIds(address: string, sector: string): Promise<BigNumber []> {
    const contract = await Ticked1155Service.getContract(address)
    return contract['getSoldTokenIds'](sector)
  }

  public async getTicketAttr(address: string, tokenId: number): Promise<Ticket> {
    const contract = await Ticked1155Service.getContract(address)
    return contract['ticketAttr'](tokenId)
  }

  public async setDate(address: string, newDate: number) {
    const contract = await Ticked1155Service.getContract(address, true)
    await contract['setDate'](newDate)
  }

  public async setApprovalForAll(address: string, operator: string, approved: boolean) {
    const contract = await Ticked1155Service.getContract(address, true)
    contract['setApprovalForAll'](operator, approved)
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
