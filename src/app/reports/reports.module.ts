import { NgModule } from '@angular/core';
import { SheardModule } from '../sheard.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { fullPoReportComponent } from './full-po-report.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MyLineChartComponent } from './charts/my-line-chart.component';
import { DashComponent } from './charts/dash.component';
import { MyBarChartComponent } from './charts/my-bar-chart.component';
import { MyBubbleChartComponent } from './charts/my-bubble-chart.component';
import { MyPieChartComponent } from './charts/my-pie-chart.component';
import { FinalReportTablesComponent } from './final-report-tables.component';
import { InOutTotalComponent } from './in-out-total.component';




@NgModule({
  declarations: [fullPoReportComponent, DashComponent, FinalReportTablesComponent, InOutTotalComponent,
    MyPieChartComponent, MyLineChartComponent, MyBarChartComponent, MyBubbleChartComponent],
  imports: [
    SheardModule,
    ReportsRoutingModule,
    NgxChartsModule,
  ]
})
export class ReportsModule { }
