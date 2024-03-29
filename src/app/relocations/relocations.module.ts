import { InventoryRoutingModule } from './relocations-routing.module';
import { SheardModule } from '../sheard.module';
import { NgModule } from '@angular/core';
import { RelocationsDetailsDialogComponent } from './relocations-details-dialog.component';
import { RelocationsComponent } from './relocations.component';
import { RelocationWeighingComponent } from './relocation-weighing.component';
import { ExpImpRelocationComponent } from './exp-imp-relocation.component';

@NgModule({
  declarations: [
  // MaterialExportPoComponent, MaterialExportItemComponent, 
  RelocationsComponent, RelocationsDetailsDialogComponent, RelocationWeighingComponent, ExpImpRelocationComponent
  // TransferCountComponent,
  ],
  imports: [
    SheardModule,
    InventoryRoutingModule,
  ],
  entryComponents: [RelocationsDetailsDialogComponent]
})
export class RelocationsModule { }