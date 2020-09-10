import { GenralCountComponent } from './genral-count.component';
import { CashewCountComponent } from './cashew-count.component';
import { InventoryRoutingModule } from './inventory-routing.module';
import { CashewInventoryComponent } from './cashew-inventory.component';
import { GenralInventoryComponent } from './genral-inventory.component';
import { SheardModule } from './../sheard.module';
import { NgModule } from '@angular/core';
import { MaterialExportComponent } from './material-export.component';
import { InventoryDetailsDialogComponent } from './inventory-details-dialog.component';
import { InventoryComponent } from './inventory.component';
import { InventoryHopperRoastingComponent } from './inventory-hopper-roasting.component';

@NgModule({
  declarations: [GenralInventoryComponent, CashewInventoryComponent, CashewCountComponent, GenralCountComponent,
  // MaterialExportPoComponent, MaterialExportItemComponent, 
  MaterialExportComponent, InventoryComponent, InventoryDetailsDialogComponent,
  InventoryHopperRoastingComponent],
  imports: [
    SheardModule,
    InventoryRoutingModule,
  ],
  entryComponents: [InventoryDetailsDialogComponent]
})
export class InventoryModule { }