import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlymineRoutingModule } from './onlymine-routing.module';
import { OnlymineComponent } from './onlymine.component';
import { SheardModule } from '../sheard.module';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [OnlymineComponent],
  imports: [
    CommonModule,
    OnlymineRoutingModule,
    MatProgressBarModule,
    SheardModule
  ]
})
export class OnlymineModule { }
