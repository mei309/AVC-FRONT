import { NgModule } from '@angular/core';
import { SheardModule } from './../sheard.module';
import { EditSupplierComponent } from './edit-supplier.component';
import { NewSupplierComponent } from './new-suppliers.component';
import { SupplierDetailsDialogComponent } from './supplier-details-dialog-component';
import { SuppliersRoutingModule } from './suppliers-routing.module';
import { SuppliersComponent } from './suppliers.component';

@NgModule({
  declarations: [NewSupplierComponent, SuppliersComponent, SupplierDetailsDialogComponent,
    EditSupplierComponent],
  imports: [
    SheardModule,
    SuppliersRoutingModule,
  ],
  entryComponents: [SupplierDetailsDialogComponent]
})
export class SuppliersModule { }