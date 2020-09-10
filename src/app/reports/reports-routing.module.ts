import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { fullPoReportComponent } from './full-po-report.component';


const routes: Routes = [
  { path: 'FullPoReport', component: fullPoReportComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
