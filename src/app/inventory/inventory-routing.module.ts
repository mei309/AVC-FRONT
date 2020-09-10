import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashewCountComponent } from './cashew-count.component';
import { CashewInventoryComponent } from './cashew-inventory.component';
import { GenralCountComponent } from './genral-count.component';
import { GenralInventoryComponent } from './genral-inventory.component';
import { MaterialExportComponent } from './material-export.component';
import { InventoryComponent } from './inventory.component';
import { InventoryHopperRoastingComponent } from './inventory-hopper-roasting.component';

const routes: Routes = [
      { path: 'CashewInventory', component: CashewInventoryComponent},
      { path: 'GenralInventory', component: GenralInventoryComponent},
      { path: 'CashewCount', component: CashewCountComponent},
      { path: 'GenralCount', component: GenralCountComponent},
      // { path: 'MaterialExportPo', component: MaterialExportPoComponent},
      // { path: 'MaterialExportItem', component: MaterialExportItemComponent},
      { path: 'MaterialExport', component: MaterialExportComponent},
      { path: 'InventoryReports', component: InventoryComponent},
      { path: 'HopperRoasting', component:  InventoryHopperRoastingComponent},
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
