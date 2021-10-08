import { NgModule } from '@angular/core';
import { SheardModule } from './../sheard.module';
import { EditDialogComponent } from './edit-dialog.component';
import { ItemsSetupComponent } from './items-setup.component';
import { ManagmentNotificationsComponent, EditNotifictionsDialogComponent } from './manager-notifications.component';
import { ManagerRoutingModule } from './manager-routing.module';
import { ManagmentSetupComponent } from './manager-setup.component';
import { ManagmentUsersComponent } from './manager-users.component';
import { NamingPipe } from './naming-setup.pipe';
import { PlanProductionComponent } from './plan-production.component';
import { PlanScheduleComponent, PlanScheduleDialogComponent } from './plan-new-schedule.component';
import { RemoveManagment } from './remove-managment.component';
import { BillOfMaterialsComponent } from './bill-of-materials.component';

@NgModule({
  declarations: [EditDialogComponent, EditNotifictionsDialogComponent, ManagmentNotificationsComponent, ManagmentUsersComponent, ManagmentSetupComponent, BillOfMaterialsComponent,
    ItemsSetupComponent, PlanProductionComponent, PlanScheduleComponent, PlanScheduleDialogComponent, RemoveManagment, NamingPipe],
  imports: [
    SheardModule,
    ManagerRoutingModule
  ],
  entryComponents: [EditDialogComponent, EditNotifictionsDialogComponent, PlanScheduleDialogComponent]
})
export class ManagerModule { }
