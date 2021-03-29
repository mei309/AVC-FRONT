import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlymineComponent } from './onlymine.component';

const routes: Routes = [{ path: '', component: OnlymineComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlymineRoutingModule { }
