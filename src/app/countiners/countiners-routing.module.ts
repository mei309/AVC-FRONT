import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountinersArrivalComponent } from './countiners-arrival.component';
import { CountinersBookingComponent } from './countiners-booking.component';
import { CountinersLoadingComponent } from './countiners-loading.component';
import { CountinersReportsComponent } from './counteiners-reports.component';

const routes: Routes = [
    { path: 'Booking', component: CountinersBookingComponent},
    { path: 'Arrival', component: CountinersArrivalComponent},
    { path: 'Loading', component: CountinersLoadingComponent, runGuardsAndResolvers: 'always'},
    { path: 'CountinerReports', component: CountinersReportsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountinersRoutingModule { }
