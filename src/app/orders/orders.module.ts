import { NgModule } from '@angular/core';
import { SheardModule } from './../sheard.module';
import { NewCashewOrderComponent } from './new-cashew-order.component';
import { NewGenralOrderComponent } from './new-genral-order.component';
import { OrderDetailsDialogComponent } from './order-details-dialog-component';
import { OrdersCashewComponent } from './orders-cashew.component';
import { OrdersGenralComponent } from './orders-genral.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { ReceiveCashewComponent } from './receive-cashew.component';
import { ReceiveGenralComponent } from './receive-genral.component';
import { ReceiveProcssComponent } from './receive-procss.component';
// import { SampleWeightsComponent } from './sample-weights.component';



@NgModule({
  declarations: [NewGenralOrderComponent, NewCashewOrderComponent, OrdersGenralComponent, OrdersCashewComponent, ReceiveCashewComponent, ReceiveGenralComponent,
  ReceiveProcssComponent, OrderDetailsDialogComponent
  // , SampleWeightsComponent
],
  imports: [
    SheardModule,
    OrdersRoutingModule,
  ],
  entryComponents: [OrderDetailsDialogComponent]
})
export class OrdersModule { }