import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateConcertComponent } from './components/concert-management/create-concert/create-concert.component';
import { MyConcertsComponent } from './components/concert-management/my-concerts/my-concerts.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { ResellComponent } from './components/resell/resell.component';
import { SellComponent } from './components/sell/sell.component';

const routes: Routes = [
  { path: '', redirectTo: '/marketplace', pathMatch: 'full' },
  { path: 'sell', component: SellComponent },
  { path: 'resell', component: ResellComponent },
  { path: 'marketplace', component: MarketplaceComponent },
  { path: 'create-concert', component: CreateConcertComponent },
  { path: 'my-concerts', component: MyConcertsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
