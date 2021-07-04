import { GenralCountComponent } from './genral-count.component';
import { CashewCountComponent } from './cashew-count.component';
import { InventoryRoutingModule } from './inventory-routing.module';
import { CashewInventoryComponent } from './cashew-inventory.component';
import { GenralInventoryComponent } from './genral-inventory.component';
import { SheardModule } from './../sheard.module';
import { NgModule } from '@angular/core';
import { InventoryDetailsDialogComponent } from './inventory-details-dialog.component';
import { MaterialUsageComponent } from './material-use.component';
import { InventoryReportsComponent } from './inventory.component';
import { InventoryRelocationComponent } from './inventory-reloaction.component';
import { CashewUseComponent } from './cashew-use.component';
import { ExportUsageComponent } from './exp-imp-usage.component';
@NgModule({
  declarations: [GenralInventoryComponent, CashewInventoryComponent, CashewCountComponent, GenralCountComponent,
  // MaterialExportPoComponent, MaterialExportItemComponent, 
  InventoryDetailsDialogComponent, MaterialUsageComponent, InventoryReportsComponent, InventoryRelocationComponent,
  CashewUseComponent, ExportUsageComponent
  // TransferCountComponent,
  ],
  imports: [
    SheardModule,
    InventoryRoutingModule,
  ],
  entryComponents: [InventoryDetailsDialogComponent]
})
export class InventoryModule { }