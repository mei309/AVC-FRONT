import { NgModule } from '@angular/core';
import { SheardModule } from './../sheard.module';
import { MassagesListComponent } from './massages-list.component';
import { TodoListComponent } from './todo-list.component';
import { TodoMassagesPopupComponent } from './todo-massagess-popup.component';
import { TodoRoutingModule } from './todo-routing.module';

@NgModule({
  declarations: [TodoListComponent, MassagesListComponent, TodoMassagesPopupComponent],
  imports: [
    SheardModule,
    TodoRoutingModule
  ],
  entryComponents: [TodoMassagesPopupComponent]
})
export class TodoModule { }
