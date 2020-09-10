import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewSpecialOrderComponent } from './new-special-order.component';
import { SpecialOrdersComponent } from './special-orders.component';

const routes: Routes = [
      { path: 'NewSpecialOrder', component: NewSpecialOrderComponent},
      { path: 'SpecialOrders', component: SpecialOrdersComponent},
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecialOrdersRoutingModule { }
