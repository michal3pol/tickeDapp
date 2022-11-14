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
import { SellComponent } from './components/marketplace/sell/sell.component';
import { ResellComponent } from './components/marketplace/resell/resell.component';
import { MarketplaceComponent } from './components/marketplace/marketplace-comp/marketplace.component';
import { MatMenuModule } from '@angular/material/menu';
import { ReactiveFormsModule} from '@angular/forms';
import { ConcertManagementModule } from './components/concert-management/concert-management.module';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MarketplaceModule } from './components/marketplace/marketplace.module';

@NgModule({
  declarations: [
    AppComponent,
    TransferComponent,
    FooterComponent,
    NavigationBarComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatButtonModule, 
    ReactiveFormsModule,
    MatMenuModule,
    MatSnackBarModule,
    // custom
    ConcertManagementModule,
    MarketplaceModule
  ],
  providers: [
    WalletService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
