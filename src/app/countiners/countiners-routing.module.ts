import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountinersArrivalComponent } from './countiners-arrival.component';
import { CountinersBookingComponent } from './countiners-booking.component';
import { CountinersLoadingComponent } from './countiners-loading.component';
import { CountinersReportsComponent } from './counteiners-reports.component';
import { SecurityExportDocComponent } from './security-export-doc.component';


const routes: Routes = [
    { path: 'Booking', component: CountinersBookingComponent},
    { path: 'Arrival', component: CountinersArrivalComponent},
    { path: 'Loading', component: CountinersLoadingComponent},
    { path: 'CountinerReports', component: CountinersReportsComponent},
    { path: 'SecurityExportDoc', component: SecurityExportDocComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountinersRoutingModule { }
