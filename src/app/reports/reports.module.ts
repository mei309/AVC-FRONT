import { NgModule } from '@angular/core';
import { SheardModule } from '../sheard.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { FinalReportComponent } from './final-report.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FinalReportTablesComponent } from './final-report-tables.component';
import { InOutTotalComponent } from './in-out-total.component';
import { FinalReportChartsComponent } from './final-report-charts.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { LayoutModule } from '@angular/cdk/layout';
import { FinalReportFullComponent } from './final-report-full.component';
import { FinalReportSummaryComponent } from './final-report-summary.component';
import { ProductionsByTimeComponent } from './production-by-time.component';
import { InventoryByTypeComponent } from './inventory-by-type.component';




@NgModule({
  declarations: [FinalReportComponent, FinalReportChartsComponent, FinalReportTablesComponent, 
    InOutTotalComponent, FinalReportFullComponent, FinalReportSummaryComponent, ProductionsByTimeComponent,
    InventoryByTypeComponent],
  imports: [
    SheardModule,
    ReportsRoutingModule,
    NgxChartsModule,
    MatGridListModule,
    LayoutModule,
  ]
})
export class ReportsModule { }
