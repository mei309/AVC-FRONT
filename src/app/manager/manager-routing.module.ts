import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagmentNotificationsComponent } from './manager-notifications.component';
import { ManagmentSetupComponent } from './manager-setup.component';
import { ManagmentUsersComponent } from './manager-users.component';
import { PlanProductionComponent } from './plan-production.component';

const routes: Routes = [
  { path: 'ManagerUsers', component: ManagmentUsersComponent},
  { path: 'ManagerSetup', component: ManagmentSetupComponent},
  { path: 'ManagmentNotifications', component: ManagmentNotificationsComponent},
  { path: 'ProductionPlan', component: PlanProductionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
