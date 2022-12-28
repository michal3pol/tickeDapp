import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketplaceComponent } from './marketplace-comp/marketplace.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { ConcertSellComponent } from './concert-sell/concert-sell.component';
import { ConcertSectorsComponent } from './concert-sectors/concert-sectors.component';
import { SwiperModule } from "swiper/angular";
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { AudienceLayoutComponent } from './audience-layout/audience-layout.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { StandardTicketComponent } from './standard-ticket/standard-ticket.component';
import { ReselledTicketComponent } from './reselled-ticket/reselled-ticket.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    MarketplaceComponent,
    ConcertSellComponent,
    ConcertSectorsComponent,
    AudienceLayoutComponent,
    StandardTicketComponent,
    ReselledTicketComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    RouterModule,
    SwiperModule,
    FormsModule,
    PipesModule
  ]
})
export class MarketplaceModule { }
