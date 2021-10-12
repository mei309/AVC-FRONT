import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExportReportComponent } from './export-report.component';
import { FinalReportComponent } from './final-report.component';
import { InventoryByTimeComponent } from './inventory-by-time.component';
import { InventoryByTypeComponent } from './inventory-by-type.component';
import { InventoryGeneralTimeComponent } from './inventory-general-time.component';
import { ProductionsByTimeComponent } from './production-by-time.component';
import { QcsTotalsComponent } from './qc-supplier-totals.component';
import { GeneralMaterialUsagesComponent } from './general-material-usages.component';


const routes: Routes = [
  { path: 'FullPoReport', component: FinalReportComponent},
  { path: 'ProductionsByTime', component: ProductionsByTimeComponent},
  { path: 'InventoryByType', component: InventoryByTypeComponent},
  { path: 'InventoryByTime', component: InventoryByTimeComponent},
  { path: 'InventoryGeneralTime', component: InventoryGeneralTimeComponent},
  { path: 'ExportReport', component: ExportReportComponent},
  { path: 'QCTotals', component: QcsTotalsComponent},
  { path: 'GeneralMaterialUsages', component: GeneralMaterialUsagesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
