import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditSupplierComponent } from './edit-supplier.component';
import { NewSupplierComponent } from './new-suppliers.component';
import { SuppliersComponent } from './suppliers.component';

const routes: Routes = [
      { path: 'Suppliers', component: SuppliersComponent },
      { path: 'NewSupplier', component: NewSupplierComponent, runGuardsAndResolvers: 'always'},
      { path: 'EditSupplier', component: EditSupplierComponent },
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersRoutingModule { }
