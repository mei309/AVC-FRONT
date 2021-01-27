import { NgModule } from '@angular/core';
import { SheardModule } from '../sheard.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { fullPoReportComponent } from './full-po-report.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FinalReportTablesComponent } from './final-report-tables.component';
import { InOutTotalComponent } from './in-out-total.component';
import { FinalReportChartsComponent } from './final-report-charts.component';




@NgModule({
  declarations: [fullPoReportComponent, FinalReportChartsComponent, FinalReportTablesComponent, InOutTotalComponent,],
  imports: [
    SheardModule,
    ReportsRoutingModule,
    NgxChartsModule,
  ]
})
export class ReportsModule { }
