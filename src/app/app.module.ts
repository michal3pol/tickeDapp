import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { FooterComponent } from './components/footer/footer.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component'
import { WalletService } from './services/wallet.service';
import { SellComponent } from './components/sell/sell.component';
import { ResellComponent } from './components/resell/resell.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule} from '@angular/forms';
import { ConcertManagementModule } from './components/concert-management/concert-management.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    TransferComponent,
    FooterComponent,
    NavigationBarComponent,
    SellComponent,
    ResellComponent,
    MarketplaceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatButtonModule, 
    ReactiveFormsModule,
    MatMenuModule,
    // custom
    ConcertManagementModule,
  ],
  providers: [
    WalletService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
