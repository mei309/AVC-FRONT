import { InventoryRoutingModule } from './relocations-routing.module';
import { SheardModule } from '../sheard.module';
import { NgModule } from '@angular/core';
import { RelocationsDetailsDialogComponent } from './relocations-details-dialog.component';
import { RelocationCountComponent } from './relocation-count.component';
import { RelocationsComponent } from './relocations.component';

@NgModule({
  declarations: [
  // MaterialExportPoComponent, MaterialExportItemComponent, 
  RelocationsComponent, RelocationsDetailsDialogComponent, RelocationCountComponent, 
  // TransferCountComponent,
  ],
  imports: [
    SheardModule,
    InventoryRoutingModule,
  ],
  entryComponents: [RelocationsDetailsDialogComponent]
})
export class RelocationsModule { }