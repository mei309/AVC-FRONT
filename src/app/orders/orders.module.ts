import { NgModule } from '@angular/core';
import { SheardModule } from './../sheard.module';
import { NewCashewOrder } from './new-c-order.component';
import { NewGenralOrder } from './new-g-order.component';
import { OrderDetailsDialogComponent } from './order-details-dialog-component';
import { OrdersCReports } from './orders-c-reports.component';
import { OrdersGReports } from './orders-g-reports.component';
import { OrdersRoutingModule } from './orders-routing.module';

@NgModule({
  declarations: [NewGenralOrder, NewCashewOrder, OrdersGReports, OrdersCReports,
    OrderDetailsDialogComponent
],
  imports: [
    SheardModule,
    OrdersRoutingModule,
  ],
  entryComponents: [OrderDetailsDialogComponent]
})
export class OrdersModule { }