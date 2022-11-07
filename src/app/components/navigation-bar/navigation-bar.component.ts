import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  ) { }

  async connectWallet() {
    this.isLogged = await this.walletService.logIn();
  }

  async goToConcertForm() {

    const authorization: boolean = await this.tickedFactoryService.authorizeAccess(
      await this.walletService.getWalletAddress()
      //"0x1cBC2050122E79e5EEd8a5DFFCA5163239a8D61E"
      );

    if(authorization) {
      console.log(authorization + "access authorized");
    } else {
      console.log(authorization + "access not authorized");
      return;
    }

    const navigationDetails: string[] = ['/create-concert'];
    this.router.navigate(navigationDetails);
  }

}
