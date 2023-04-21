import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThaiDatepickerModule } from '../thai-datepicker/thai-datepicker.module';
import { ThaiDatePipe } from '../pipe/thai-date.pipe';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    ThaiDatePipe,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ThaiDatepickerModule
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ThaiDatepickerModule,
    ThaiDatePipe
  ]
})
export class SharedModule { }
