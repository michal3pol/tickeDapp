import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateConcertComponent } from './components/concert-management/create-concert/create-concert.component';
import { MyConcertsComponent } from './components/concert-management/my-concerts/my-concerts.component';
import { WhitelistComponent } from './components/concert-management/whitelist/whitelist.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { ResellComponent } from './components/resell/resell.component';
import { SellComponent } from './components/sell/sell.component';
import { AuthOrganizatorGuard } from './services/auth-organizator.guard';

const routes: Routes = [
  { path: '', redirectTo: '/marketplace', pathMatch: 'full' },
  { path: 'sell', component: SellComponent },
  { path: 'resell', component: ResellComponent },
  { path: 'marketplace', component: MarketplaceComponent },
  { path: 'create-concert', canActivate:[AuthOrganizatorGuard], component: CreateConcertComponent },
  { path: 'my-concerts', canActivate:[AuthOrganizatorGuard], component: MyConcertsComponent },
  { path: 'whitelist', component: WhitelistComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
