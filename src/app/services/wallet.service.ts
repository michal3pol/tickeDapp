import { Injectable } from '@angular/core';
import { ethers, Wallet } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  protected accounts: any;
  protected wallet?: Wallet;

  async logIn(): Promise<boolean> {

    // TODO check if user is connected or not on proper account!
    if(window.ethereum) {
      this.accounts = await window?.ethereum.request({ method: 'eth_requestAccounts' })  
      this.wallet = this.accounts[0]
      return true
    }
    return false
  }

  async getWalletAddress(): Promise<any> {
    const provider = new ethers.providers.Web3Provider(<any>window.ethereum);
    let accounts = await provider.send("eth_requestAccounts", []);
    let account = accounts[0];

    const signer = provider.getSigner();
    return await signer.getAddress();
  }
}
