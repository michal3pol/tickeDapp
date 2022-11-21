import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyNftComponent } from './my-nft/my-nft.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    MyNftComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
  ]
})
export class UserModule { }
