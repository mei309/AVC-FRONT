import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinalReportComponent } from './final-report.component';


const routes: Routes = [
  { path: 'FullPoReport', component: FinalReportComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
