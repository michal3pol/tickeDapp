import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { TimeSpentServiceService } from './services/time-spent-service.service';
import { WalletService } from './services/wallet.service';

export interface PageInfo {
  pageUrl: string;
  timeSpent: number;
  wallet: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tickeDapp';
  links = ['sell', 'resell'];
  activeLink = this.links[0];

  currentPage = '';
  timeSpentOnPages: PageInfo[] = [];
  moment = moment;
  constructor(private router: Router, 
              private timeSpentService: TimeSpentServiceService,
              private walletService: WalletService) {
    this.router.events.subscribe(async (event: any)=> {
      if (!this.currentPage) {
        this.currentPage = event.url;
      }
      if (this.currentPage !== event.url) {
        const timeSpent = Date.now();
        console.log('timeSpent', timeSpent);
        const pageInfo = {
          pageUrl : this.currentPage,
          timeSpent: Date.now(),
          wallet: await this.walletService.getWalletAddress()
        }
        this.currentPage = event.url;
        this.timeSpentService.timeSpentOnPages.push(pageInfo);
      }
    })
  }

}
