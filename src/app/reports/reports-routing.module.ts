import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExportReportComponent } from './export-report.component';
import { FinalReportComponent } from './final-report.component';
import { InventoryByTimeComponent } from './inventory-by-time.component';
import { InventoryByTypeComponent } from './inventory-by-type.component';
import { ProductionsByTimeComponent } from './production-by-time.component';
import { QcsTotalsComponent } from './qc-supplier-totals.component';


const routes: Routes = [
  { path: 'FullPoReport', component: FinalReportComponent},
  { path: 'ProductionsByTime', component: ProductionsByTimeComponent},
  { path: 'InventoryByType', component: InventoryByTypeComponent},
  { path: 'InventoryByTime', component: InventoryByTimeComponent},
  { path: 'ExportReport', component: ExportReportComponent},
  { path: 'QCTotals', component: QcsTotalsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
