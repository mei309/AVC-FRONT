import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewCashewOrder } from './new-c-order.component';
import { NewGenralOrder } from './new-g-order.component';
import { OrdersCReports } from './orders-c-reports.component';
import { OrdersGReports } from './orders-g-reports.component';
import { PoCodesComponent } from './po-codes.component';

const routes: Routes = [
      { path: 'NewCashewOrder', component: NewCashewOrder, runGuardsAndResolvers: 'always'},
      { path: 'NewGenralOrder', component: NewGenralOrder, runGuardsAndResolvers: 'always'},
      { path: 'OrdersCReports', component: OrdersCReports},
      { path: 'OrdersGReports', component: OrdersGReports},
      { path: 'PoCodesComponent', component: PoCodesComponent},
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
