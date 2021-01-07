import { NgModule } from '@angular/core';
import { ReceiveCAlone } from './receive-c-alone.component';
import { ReceiveCOrder } from './receive-c-order.component';
import { ReceiveCReports } from './receive-c-reports.component';
import { ReceiveGOrder } from './receive-g-order.component';
import { SheardModule } from './../sheard.module';
import {ReceiptRoutingModule} from './receipt-routing.module';
import { ReceiptDialog } from './receipt-dialog.component';

@NgModule({
  declarations: [ReceiveCOrder, ReceiveGOrder,
    ReceiveCAlone, ReceiptDialog, ReceiveCReports
],
  imports: [
    SheardModule,
    ReceiptRoutingModule,
  ],
  entryComponents: [ReceiptDialog]
})
export class ReceiptModule { }