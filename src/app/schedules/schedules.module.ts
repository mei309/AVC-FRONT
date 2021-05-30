import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SheardModule } from './../sheard.module';
import { PlanReceivingComponent } from './plan-receiving.component';
import { ProductionScheduleComponent } from './production-schedule.component';
import { SchedulesRoutingModule } from './schedules-routing.module';
import { ReceivingCashewScheduleComponent } from './receiving-cashew-schedule.component';
import { ReceivingGeneralScheduleComponent } from './reciving-general-schedule.component';
import { SumsTableSchedulesComponent } from './sums-table-schedules.component';



@NgModule({
  declarations: [ReceivingCashewScheduleComponent, ReceivingGeneralScheduleComponent, ProductionScheduleComponent, PlanReceivingComponent,
    SumsTableSchedulesComponent],
  imports: [
    CommonModule,
    SchedulesRoutingModule,
    SheardModule,
  ]
})
export class SchedulesModule { }
