import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuppliersTestComponent } from './suppliers-test.component';
// import { OrdersTestComponent } from './orders-test.component';
import { QcTestComponent } from './qc-test.component';
import { ManagmentTestComponent } from './managment-test.component';
// import { XlxsImportsComponent } from './xlxs-import.component';
const routes: Routes = [
  { path: 'managment', component: ManagmentTestComponent },
  { path: 'suppliers', component: SuppliersTestComponent},
  // { path: 'orders', component: OrdersTestComponent},
  { path: 'qc', component: QcTestComponent},
  // { path: 'xlxsImport', component: XlxsImportsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTestsRoutingModule { }
