import { NgModule } from '@angular/core';
import { SheardModule } from '../sheard.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { fullPoReportComponent } from './full-po-report.component';



@NgModule({
  declarations: [fullPoReportComponent],
  imports: [
    SheardModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
