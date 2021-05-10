import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinalReportComponent } from './final-report.component';
import { InventoryByTypeComponent } from './inventory-by-type.component';
import { ProductionsByTimeComponent } from './production-by-time.component';


const routes: Routes = [
  { path: 'FullPoReport', component: FinalReportComponent},
  { path: 'ProductionsByTime', component: ProductionsByTimeComponent},
  { path: 'InventoryByType', component: InventoryByTypeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
