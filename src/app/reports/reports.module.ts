import { NgModule } from '@angular/core';
import { SheardModule } from '../sheard.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { fullPoReportComponent } from './full-po-report.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FinalReportTablesComponent } from './final-report-tables.component';
import { InOutTotalComponent } from './in-out-total.component';
import { FinalReportChartsComponent } from './final-report-charts.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';




@NgModule({
  declarations: [fullPoReportComponent, FinalReportChartsComponent, FinalReportTablesComponent, InOutTotalComponent,],
  imports: [
    SheardModule,
    ReportsRoutingModule,
    NgxChartsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
  ]
})
export class ReportsModule { }
