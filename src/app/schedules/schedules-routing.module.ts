import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanReceivingComponent } from './plan-receiving.component';
import { ProductionScheduleComponent } from './production-schedule.component';
import { ReceivingCashewScheduleComponent } from './receiving-cashew-schedule.component';
import { ReceivingGeneralScheduleComponent } from './reciving-general-schedule.component';

const routes: Routes = [
      { path: 'ReceivingCashewSchedule', component: ReceivingCashewScheduleComponent },
      { path: 'ReceivingGeneralSchedule', component: ReceivingGeneralScheduleComponent },
      { path: 'ReceivingPlan', component: PlanReceivingComponent },
      { path: 'ProductionSchedule', component: ProductionScheduleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulesRoutingModule { }
