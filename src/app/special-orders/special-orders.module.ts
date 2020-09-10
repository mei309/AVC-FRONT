import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SheardModule } from './../sheard.module';
import { NewSpecialOrderComponent } from './new-special-order.component';
import { SpecialOrdersDialogComponent } from './special-orders-dialog.component';
import { SpecialOrdersRoutingModule } from './special-orders-routing.module';
import { SpecialOrdersComponent } from './special-orders.component';

@NgModule({
  declarations: [NewSpecialOrderComponent, SpecialOrdersComponent, SpecialOrdersDialogComponent],
  imports: [
    CommonModule,
    SheardModule,
    SpecialOrdersRoutingModule,
  ],
  entryComponents: [SpecialOrdersDialogComponent]
})
export class SpecialOrdersModule { }