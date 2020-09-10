import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MassagesListComponent } from './massages-list.component';
import { TodoListComponent } from './todo-list.component';

const routes: Routes = [
    { path: 'Todo', component: TodoListComponent },
    { path: 'Massages', component: MassagesListComponent },
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoRoutingModule { }
