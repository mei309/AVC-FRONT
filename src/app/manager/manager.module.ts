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
import { RemoveManagment } from './remove-managment.component';

@NgModule({
  declarations: [EditDialogComponent, EditNotifictionsDialogComponent, ManagmentNotificationsComponent, ManagmentUsersComponent, ManagmentSetupComponent,
    ItemsSetupComponent, PlanProductionComponent, RemoveManagment, NamingPipe],
  imports: [
    SheardModule,
    ManagerRoutingModule
  ],
  entryComponents: [EditDialogComponent, EditNotifictionsDialogComponent]
})
export class ManagerModule { }
