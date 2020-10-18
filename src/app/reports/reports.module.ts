import { NgModule } from '@angular/core';
import { SheardModule } from '../sheard.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { fullPoReportComponent } from './full-po-report.component';
import { ChartsModule } from 'ng2-charts';
import { MyLineChartComponent } from './my-line-chart.component';
import { DashComponent } from './dash.component';
import { MyBarChartComponent } from './my-bar-chart.component';
import { MyBubbleChartComponent } from './my-bubble-chart.component';
import { MyPieChartComponent } from './my-pie-chart.component';



@NgModule({
  declarations: [fullPoReportComponent, MyLineChartComponent, DashComponent, MyBubbleChartComponent,
    MyPieChartComponent, MyBarChartComponent],
  imports: [
    SheardModule,
    ReportsRoutingModule,
    ChartsModule,
  ]
})
export class ReportsModule { }
