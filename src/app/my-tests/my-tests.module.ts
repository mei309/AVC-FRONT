import { NgModule } from '@angular/core';
import { MyTestsRoutingModule } from './my-tests-routing.module';
import { SuppliersTestComponent } from './suppliers-test.component';
import { OrdersTestComponent } from './orders-test.component';
import { SheardModule } from './../sheard.module';
import { QcTestComponent } from './qc-test.component';
import { ManagmentTestComponent } from './managment-test.component';
import { XlxsImportsComponent } from './xlxs-import.component';

@NgModule({
  declarations: [SuppliersTestComponent, OrdersTestComponent, QcTestComponent, ManagmentTestComponent, XlxsImportsComponent],
  imports: [
    SheardModule,
    MyTestsRoutingModule
  ]
})
export class MyTestsModule { }
