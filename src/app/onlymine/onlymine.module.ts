import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlymineRoutingModule } from './onlymine-routing.module';
import { OnlymineComponent } from './onlymine.component';
import { SheardModule } from '../sheard.module';

@NgModule({
  declarations: [OnlymineComponent],
  imports: [
    CommonModule,
    OnlymineRoutingModule,
    SheardModule
  ]
})
export class OnlymineModule { }
