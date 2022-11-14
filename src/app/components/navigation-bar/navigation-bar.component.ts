import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TickedFactoryService } from 'src/app/services/ticked-factory.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {

  isLogged: boolean = false; // figure out how to show that wallet is connected

  constructor(
    private walletService: WalletService,
    private tickedFactoryService: TickedFactoryService,
    private router: Router,
    private snackbarService: SnackbarService,
  ) { }

  async connectWallet() {
    this.isLogged = await this.walletService.logIn();
  }

  async goToConcertForm() {
    const authorization: boolean = await this.tickedFactoryService.authorizeAccess(
      await this.walletService.getWalletAddress()
      );

    if(authorization) {
      const navigationDetails: string[] = ['/create-concert'];
      this.router.navigate(navigationDetails);
    } else {
      this.snackbarService.error("Access not authorized!")
      return;
    }
  }

  async goToMyConcerts() {
    const authorization: boolean = await this.tickedFactoryService.authorizeAccess(
      await this.walletService.getWalletAddress()
      );

    if(authorization) {
      const navigationDetails: string[] = ['/my-concerts'];
      this.router.navigate(navigationDetails);
    } else {
      this.snackbarService.error("Access not authorized!")
      return;
    }
  }

  async goToAdminPanel() {
    const isOwner: boolean = await this.tickedFactoryService.validateOwner(
      await this.walletService.getWalletAddress()
    )
    
    if(isOwner){
      const navigationDetails: string[] = ['/whitelist'];
      this.router.navigate(navigationDetails);
    } else {
      this.snackbarService.error("Access not authorized!")
    }
  }

  goToMarketplace() {
    const navigationDetails: string[] = ['/marketplace/sell'];
    this.router.navigate(navigationDetails);
  }


}
