import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QcCleaningComponent } from './qc-cleaning.component';
import { QcMachinsComponent } from './qc-machins.component';
import { QcPackingComponent } from './qc-packing.component';
import { QcReceiveComponent } from './qc-receive.component';
import { QcRoastingComponent } from './qc-roasting.component';
import { QcToffeeComponent } from './qc-toffee.component';
import { AllQcsComponent } from './all-qcs.component';
import { QcReceivePercentageComponent } from './qc-receive-percentage.component';

const routes: Routes = [
  { path: 'Cleaning', component: QcCleaningComponent },
  { path: 'Roasting', component: QcRoastingComponent },
  { path: 'Packing', component:  QcPackingComponent},
  { path: 'Toffee', component:  QcToffeeComponent},
  { path: 'Machins', component:  QcMachinsComponent},
  { path: 'Raw', component:  QcReceiveComponent, runGuardsAndResolvers: 'always'},
  { path: 'RawPercntage', component:  QcReceivePercentageComponent, runGuardsAndResolvers: 'always'},
  { path: 'AllQC', component: AllQcsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QcRoutingModule { }
