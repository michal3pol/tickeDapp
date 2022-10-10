import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TransferComponent } from './components/transfer/transfer.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button'
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { FooterComponent } from './components/footer/footer.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component'

@NgModule({
  declarations: [
    AppComponent,
    TransferComponent,
    LoginComponent,
    FooterComponent,
    NavigationBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTabsModule, 

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
