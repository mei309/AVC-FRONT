import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlymineRoutingModule } from './onlymine-routing.module';
import { OnlymineComponent } from './onlymine.component';


@NgModule({
  declarations: [OnlymineComponent],
  imports: [
    CommonModule,
    OnlymineRoutingModule
  ]
})
export class OnlymineModule { }
