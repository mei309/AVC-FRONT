import { NgModule } from '@angular/core';
import { SheardModule } from '../sheard.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { FinalReportComponent } from './final-report.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FinalReportTablesComponent } from './final-report-tables.component';
import { FinalReportChartsComponent } from './final-report-charts.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { LayoutModule } from '@angular/cdk/layout';
import { FinalReportFullComponent } from './final-report-full.component';
import { FinalReportSummaryComponent } from './final-report-summary.component';
import { ProductionsByTimeComponent } from './production-by-time.component';
import { InventoryByTypeComponent } from './inventory-by-type.component';
import { InventoryByTimeComponent } from './inventory-by-time.component';
import { ExportReportComponent } from './export-report.component';
import { CellsProcesses } from './cells-processes.component';
import { CellsLoading } from './cells-loading.component';
import { CellsQcs } from './cells-qcs.component';
import { QcsTotalsComponent } from './qc-supplier-totals.component';
import { SumsQcsTableComponent } from './sum-qc-table.component';
import { SumListTablesComponent } from './sum-list-tables.component';
import { InventoryGeneralTimeComponent } from './inventory-general-time.component';
import { SumsProductTypeComponent } from './sum-product-type.component';
import { GeneralMaterialUsagesComponent } from './general-material-usages.component';




@NgModule({
  declarations: [FinalReportComponent, FinalReportChartsComponent, FinalReportTablesComponent,
    FinalReportFullComponent, FinalReportSummaryComponent, ProductionsByTimeComponent, QcsTotalsComponent,
    InventoryByTypeComponent, InventoryByTimeComponent, InventoryGeneralTimeComponent,
     ExportReportComponent, CellsProcesses, CellsLoading, CellsQcs, SumsQcsTableComponent, SumListTablesComponent,
     SumsProductTypeComponent, GeneralMaterialUsagesComponent],
  imports: [
    SheardModule,
    ReportsRoutingModule,
    NgxChartsModule,
    MatGridListModule,
    LayoutModule,
  ]
})
export class ReportsModule { }
