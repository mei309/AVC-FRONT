import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashewCountComponent } from './cashew-count.component';
import { CashewInventoryComponent } from './cashew-inventory.component';
import { CashewUseComponent } from './cashew-use.component';
import { GenralCountComponent } from './genral-count.component';
import { GenralInventoryComponent } from './genral-inventory.component';
import { InventoryRelocationComponent } from './inventory-reloaction.component';
import { InventoryReportsComponent } from './inventory.component';
import { MaterialUsageComponent } from './material-use.component';
import { InventoryTransactionsComponent } from './transactions.component';

const routes: Routes = [
      { path: 'CashewInventory', component: CashewInventoryComponent},
      { path: 'GenralInventory', component: GenralInventoryComponent},
      { path: 'CashewCount', component: CashewCountComponent},
      { path: 'GenralCount', component: GenralCountComponent},
      { path: 'MaterialUse', component: MaterialUsageComponent},
      { path: 'Reports', component: InventoryReportsComponent},
      { path: 'Relocation', component: InventoryRelocationComponent},
      { path: 'CashewUse', component: CashewUseComponent},
      { path: 'InventoryTransactions', component: InventoryTransactionsComponent},
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
