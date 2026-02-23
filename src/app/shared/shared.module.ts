import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table/table.component';
import { TableShimmerComponent } from './table-shimmer/table-shimmer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    TableComponent,
    TableShimmerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule
  ],
  exports: [
    TableComponent,
    TableShimmerComponent
  ]
})
export class SharedModule { }
