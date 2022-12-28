import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyNftComponent } from './my-nft/my-nft.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CreateOfferDialogComponent } from './create-offer-dialog/create-offer-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MyOffersComponent } from './my-offers/my-offers.component';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    MyNftComponent,
    CreateOfferDialogComponent,
    MyOffersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    PipesModule
  ]
})
export class UserModule { }
