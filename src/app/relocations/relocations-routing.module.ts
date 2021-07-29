import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { TransferCountComponent } from '../garbage/transfer-count.component';
import { RelocationWeighingComponent } from './relocation-weighing.component';
import { RelocationsComponent } from './relocations.component';

const routes: Routes = [
      // { path: 'MaterialExportPo', component: MaterialExportPoComponent},
      // { path: 'MaterialExportItem', component: MaterialExportItemComponent},
      // { path: 'MaterialExport', component: MaterialExportComponent},
      { path: 'RelocationsReports', component: RelocationsComponent},
      // { path: 'TransferCount', component:  TransferCountComponent, runGuardsAndResolvers: 'always'},
      { path: 'RelocationCount', component:  RelocationWeighingComponent, runGuardsAndResolvers: 'always'},
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
