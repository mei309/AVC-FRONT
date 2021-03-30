import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashewCountComponent } from './cashew-count.component';
import { CashewInventoryComponent } from './cashew-inventory.component';
import { GenralCountComponent } from './genral-count.component';
import { GenralInventoryComponent } from './genral-inventory.component';

const routes: Routes = [
      { path: 'CashewInventory', component: CashewInventoryComponent},
      { path: 'GenralInventory', component: GenralInventoryComponent},
      { path: 'CashewCount', component: CashewCountComponent},
      { path: 'GenralCount', component: GenralCountComponent},
      // { path: 'MaterialExportPo', component: MaterialExportPoComponent},
      // { path: 'MaterialExportItem', component: MaterialExportItemComponent},
      // { path: 'MaterialExport', component: MaterialExportComponent},
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
