import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateConcertComponent } from './components/concert-management/create-concert/create-concert.component';
import { MyConcertsComponent } from './components/concert-management/my-concerts/my-concerts.component';
import { WhitelistComponent } from './components/concert-management/whitelist/whitelist.component';
import { ConcertSectorsComponent } from './components/marketplace/concert-sectors/concert-sectors.component';
import { MarketplaceComponent } from './components/marketplace/marketplace-comp/marketplace.component';
import { ConcertSellComponent } from './components/marketplace/concert-sell/concert-sell.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthOrganizatorGuard } from './services/auth-organizator.guard';
import { MyNftComponent } from './components/user/my-nft/my-nft.component';
import { MyOffersComponent } from './components/user/my-offers/my-offers.component';

const routes: Routes = [
  { path: '', redirectTo: '/marketplace/sell', pathMatch: 'full' },
  { path: 'marketplace', component: MarketplaceComponent,
    children:[
      {
        path:'sell',
        component: ConcertSellComponent
      },
      {
        path:'sell/:address',
        component: ConcertSectorsComponent
      },
    ] 
  },
  { path: 'create-concert', canActivate:[AuthOrganizatorGuard], component: CreateConcertComponent },
  { path: 'my-concerts', canActivate:[AuthOrganizatorGuard], component: MyConcertsComponent },
  { path: 'my-nft', component: MyNftComponent },
  { path: 'my-offers', component: MyOffersComponent },
  { path: 'whitelist', component: WhitelistComponent },
  { path: '**', component:  PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
