import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewCashewOrderComponent } from './new-cashew-order.component';
import { NewGenralOrderComponent } from './new-genral-order.component';
import { OrdersCashewComponent } from './orders-cashew.component';
import { OrdersGenralComponent } from './orders-genral.component';
import { ReceiveCashewComponent } from './receive-cashew.component';
import { ReceiveGenralComponent } from './receive-genral.component';
import { ReceiveProcssComponent } from './receive-procss.component';
// import { SampleWeightsComponent } from './sample-weights.component';

const routes: Routes = [
      { path: 'NewCashewOrder', component: NewCashewOrderComponent, runGuardsAndResolvers: 'always'},
      { path: 'NewGenralOrder', component: NewGenralOrderComponent, runGuardsAndResolvers: 'always'},
      { path: 'CashewOrders', component: OrdersCashewComponent},
      { path: 'GenralOrders', component: OrdersGenralComponent},
      { path: 'CashewReceived', component: ReceiveCashewComponent, runGuardsAndResolvers: 'always'},
      { path: 'GenralReceived', component: ReceiveGenralComponent, runGuardsAndResolvers: 'always'},
      { path: 'ProcssReceived', component: ReceiveProcssComponent, runGuardsAndResolvers: 'always'},
      // { path: 'SampleWeights', component: SampleWeightsComponent},

    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
