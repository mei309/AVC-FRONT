import { NgModule } from '@angular/core';
import { SheardModule } from '../sheard.module';
import { MassagesListComponent } from './massages-list.component';
import { PassChangeComponent } from './pass-change.component';
import { TodoListComponent } from './todo-list.component';
import { TodoMassagesPopupComponent } from './todo-massagess-popup.component';
import { TodoRoutingModule } from './user-account-routing.module';

@NgModule({
  declarations: [TodoListComponent, MassagesListComponent, TodoMassagesPopupComponent, PassChangeComponent],
  imports: [
    SheardModule,
    TodoRoutingModule
  ],
  entryComponents: [TodoMassagesPopupComponent]
})
export class UserAccountModule { }
