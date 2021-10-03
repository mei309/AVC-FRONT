import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsSetupComponent } from './items-setup.component';
import { ManagmentNotificationsComponent } from './manager-notifications.component';
import { ManagmentSetupComponent } from './manager-setup.component';
import { ManagmentUsersComponent } from './manager-users.component';
import { PlanProductionComponent } from './plan-production.component';
import { PlanScheduleComponent } from './plan-new-schedule.component';
import { RemoveManagment } from './remove-managment.component';

const routes: Routes = [
  { path: 'ManagerUsers', component: ManagmentUsersComponent},
  { path: 'ManagerSetup', component: ManagmentSetupComponent},
  { path: 'ItemsSetup', component: ItemsSetupComponent},
  { path: 'ManagmentNotifications', component: ManagmentNotificationsComponent},
  { path: 'ProductionPlan', component: PlanScheduleComponent },
  { path: 'RemoveManagment', component: RemoveManagment },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
