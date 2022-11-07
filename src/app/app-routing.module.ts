import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateConcertComponent } from './components/create-concert/create-concert.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { ResellComponent } from './components/resell/resell.component';
import { SellComponent } from './components/sell/sell.component';

const routes: Routes = [
  { path: '', redirectTo: '/marketplace', pathMatch: 'full' },
  { path: 'sell', component: SellComponent },
  { path: 'resell', component: ResellComponent },
  { path: 'marketplace', component: MarketplaceComponent },
  { path: 'create-concert', component: CreateConcertComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
