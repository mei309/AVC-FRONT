import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiveCAlone } from './receive-c-alone.component';
import { ReceiveCOrder } from './receive-c-order.component';
import { ReceiveCReports } from './receive-c-reports.component';
import { ReceiveGOrder } from './receive-g-order.component';

const routes: Routes = [
      { path: 'ReceiveCReports', component: ReceiveCReports},
    //   { path: 'OrdersGReports', component: OrdersGReports},
      { path: 'ReceiveCOrder', component: ReceiveCOrder, runGuardsAndResolvers: 'always'},
      { path: 'ReceiveGOrder', component: ReceiveGOrder, runGuardsAndResolvers: 'always'},
      { path: 'ReceiveCAlone', component: ReceiveCAlone, runGuardsAndResolvers: 'always'},
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiptRoutingModule { }
