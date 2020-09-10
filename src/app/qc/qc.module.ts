import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SheardModule } from './../sheard.module';
import { QcCleaningComponent } from './qc-cleaning.component';
import { QcMachinsComponent } from './qc-machins.component';
import { QcPackingComponent } from './qc-packing.component';
import { QcReceiveComponent } from './qc-receive.component';
import { QcRoastingComponent } from './qc-roasting.component';
import { QcRoutingModule } from './qc-routing.module';
import { QcToffeeComponent } from './qc-toffee.component';
import { QcDetailsDialogComponent } from './qc-details-dialog.component';
import { AllQcsComponent } from './all-qcs.component';
import { QcReceivePercentageComponent } from './qc-receive-percentage.component';


@NgModule({
  declarations: [QcCleaningComponent, QcRoastingComponent, QcPackingComponent, QcDetailsDialogComponent,
    QcReceiveComponent, QcReceivePercentageComponent, QcMachinsComponent, QcToffeeComponent, AllQcsComponent],
  imports: [
    CommonModule,
    SheardModule,
    QcRoutingModule
  ],
  entryComponents: [QcDetailsDialogComponent]
})
export class QcModule { }
