import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button'
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { CreateConcertComponent } from './create-concert/create-concert.component';
import { MyConcertsComponent } from './my-concerts/my-concerts.component';
import {MatStepperModule} from '@angular/material/stepper';
import { SectorComponent } from './sector/sector.component';
import { MatIconModule } from '@angular/material/icon';
import { WhitelistComponent } from './whitelist/whitelist.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    CreateConcertComponent,
    MyConcertsComponent,
    SectorComponent,
    WhitelistComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTabsModule, 
    MatCardModule,
    MatStepperModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 3000,
                                                        horizontalPosition: 'center',
                                                        verticalPosition: 'top'}}
  ]
})
export class ConcertManagementModule { }
