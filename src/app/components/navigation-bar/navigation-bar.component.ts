import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TickedFactoryService } from 'src/app/services/smartcontracts/ticked-factory.service';
import { WalletService } from 'src/app/services/wallet.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {

  constructor(
    private walletService: WalletService,
    private tickedFactoryService: TickedFactoryService,
    private router: Router,
    private snackbarService: SnackbarService,
  ) { }

  /**
   * Function that connects wallet
   *
   */
  async connectWallet() {
    let isLogged = await this.walletService.logIn();
    if(isLogged){
      this.snackbarService.info("You are already connected")
    }
  }

  /**
   * Function that redirects to concert-form page
   *
   */
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

  /**
   * Function that redirects to my-concerts page
   *
   */
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

  /**
   * Function that redirects to admin panel page
   *
   */
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

  /**
   * Function that redirects to marketplace page
   *
   */
  goToMarketplace() {
    const navigationDetails: string[] = ['/marketplace/sell'];
    this.router.navigate(navigationDetails);
  }

  /**
   * Function that redirects to my-nfts page
   *
   */
  goToMyNfts() {
    const navigationDetails: string[] = ['/my-nft'];
    this.router.navigate(navigationDetails);
  }

  /**
   * Function that redirects to my-offers page
   *
   */
  goToMyOffers() {
    const navigationDetails: string[] = ['/my-offers'];
    this.router.navigate(navigationDetails);
  }

}
