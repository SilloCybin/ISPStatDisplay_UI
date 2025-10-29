import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DoubleDatepickerToggleWrapperComponent } from './double-date-calendar';
import {MatInput} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [DoubleDatepickerToggleWrapperComponent],
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInput,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [DoubleDatepickerToggleWrapperComponent]
})
export class DoubleDatepickerToggleWrapperModule {}
