import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DatepickerToggleWrapperComponent } from './single-date-calendar';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [DatepickerToggleWrapperComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInput,
    FormsModule
  ],
  exports: [DatepickerToggleWrapperComponent]
})
export class DatepickerToggleWrapperModule {}
