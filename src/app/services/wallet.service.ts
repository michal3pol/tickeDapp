import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private provider = new ethers.providers.Web3Provider(<any>window.ethereum);
  private signer = this.provider.getSigner();
  protected wallet: any;
  protected account: any;

  async logIn(): Promise<boolean> {
    if(window.ethereum) {
      this.wallet = await window?.ethereum.request({ method: 'eth_requestAccounts' })  
      this.account = this.wallet[0]
      return true;
    }
    return false;
  }

  getAccount(): any {
    return this.account
  }

}
