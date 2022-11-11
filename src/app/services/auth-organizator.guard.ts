import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TickedFactoryService } from './ticked-factory.service';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root'
})
export class AuthOrganizatorGuard implements CanActivate {
  
  constructor(
    private tickedFactoryService: TickedFactoryService,
    private walletService: WalletService,
  ) {}
  
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    
      return this.tickedFactoryService.authorizeAccess(
         await this.walletService.getWalletAddress()
      );
  }
  
}
