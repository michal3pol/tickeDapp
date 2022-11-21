import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OwnedNFTs } from 'src/types/nft.model';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root'
})
export class AlchemyApiService {

  constructor(
    private walletService: WalletService,
    private http: HttpClient
  ) { }

  async getUserNfts(): Promise<Observable<OwnedNFTs>> {
    const walletAddres = await this.walletService.getWalletAddress()
    const url = environment.alchemyApi + "/getNFTs/?owner=" + walletAddres
    return this.http.get<OwnedNFTs>(url)
  }


}
