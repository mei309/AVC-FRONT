import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SheardModule } from './../sheard.module';
import { CountinersArrivalComponent } from './countiners-arrival.component';
import { CountinersBookingComponent } from './countiners-booking.component';
import { CountinersLoadingComponent } from './countiners-loading.component';
import { CountinersRoutingModule } from './countiners-routing.module';
import { CounteinersDetailsDialogComponent } from './counteiners-details.component';
import { CountinersReportsComponent } from './counteiners-reports.component';
import { SecurityExportDocComponent } from './security-export-doc.component';
import { AddEditShipmentDialog, ShipmentCodesComponent } from './shipment-codes.component';



@NgModule({
  declarations: [CountinersBookingComponent, CountinersArrivalComponent, CountinersLoadingComponent,
    CounteinersDetailsDialogComponent, CountinersReportsComponent, SecurityExportDocComponent,
    ShipmentCodesComponent, AddEditShipmentDialog],
  imports: [
    CommonModule,
    SheardModule,
    CountinersRoutingModule
  ],
  entryComponents: [CounteinersDetailsDialogComponent, SecurityExportDocComponent, AddEditShipmentDialog]
})
export class CountinersModule { }
